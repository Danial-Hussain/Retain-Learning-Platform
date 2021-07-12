from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta
from google.cloud import bigquery
from google.oauth2 import service_account
import psycopg2
import pandas as pd
import os

def to_bigquery(**kwargs):
    db_name = os.environ.get("PG_DB")
    db_user = os.environ.get("PG_USER")
    db_pass = os.environ.get("PG_PASS")
    db_connection = psycopg2.connect(
        database=db_name,
        user=db_user,
        password=db_pass,
        port="5432", 
        host="database"
    )

    df = pd.read_sql_query(
        'select * from episodes where episode_watch_date BETWEEN (now() - interval \'1 month\') and now()',
        db_connection
    )

    key_credentials_file_path = "/usr/local/airflow/dags/gcp_service_credentials.json"

    credentials = service_account.Credentials.from_service_account_file(
        key_credentials_file_path,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )

    client = bigquery.Client(
        credentials=credentials,
        project=credentials.project_id
    )
    dataset = client.dataset('podcast_data')
    table = dataset.table('episodes')
    client.load_table_from_dataframe(df, table).result()

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email': None,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1, 
    'retry_delay': timedelta(minutes=5),
    'start_date': datetime(2020, 1, 1)
}

dag = DAG(
    dag_id="bigquery_dag",
    schedule_interval="@monthly",
    default_args=default_args,
    catchup=False
)

task = PythonOperator(
    task_id="postgres_to_bigquery",
    python_callable=to_bigquery,
    provide_context=True,
    dag=dag
)