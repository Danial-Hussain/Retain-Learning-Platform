from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta
import psycopg2
import smtplib, ssl
import os

def send_email(**kwargs):
    db_name = os.environ.get("PG_DB")
    db_user = os.environ.get("PG_USER")
    db_pass = os.environ.get("PG_PASS")
    db_conn = psycopg2.connect(
        database=db_name,
        user=db_user,
        password=db_pass,
        port="5432", 
        host="database"
    )
    data = None
    with db_conn.cursor() as cursor:
        cursor.execute(
        """
            SELECT
                info_fact,
                '2 days ago' AS "date"
            FROM info
            WHERE info_date = current_date - interval '2' day
            UNION
            SELECT
                info_fact,
                '7 days ago' AS "date"
            FROM info
            WHERE info_date = current_date - interval '7' day
            UNION
            SELECT
                info_fact,
                '14 days ago'AS "date"
            FROM info
            WHERE info_date = current_date - interval '14' day
            UNION
            SELECT
                info_fact,
                '30 days ago' AS "date"
            FROM info
            WHERE info_date = current_date - interval '30' day;
        """
        )
        data = cursor.fetchall()
        if data != None:
            receiver_email = os.environ.get("USER_EMAIL")
            sender_email = os.environ.get("SENDER_EMAIL")
            sender_password = os.environ.get("SENDER_PASS")
            subject = "Reinforcement Learning"
            text = "Daily Update" + "\n".join([f"\n{x} days ago\n" + "\n".join(
                [d[0] for d in data if d[1].find(f'{x}') != -1]
            ) for x in [2, 7, 14, 30]])
            message = """\
                Subject: %s
                %s
            """ % (subject, text)
            context = ssl.create_default_context()
            smtp_server = "smtp.gmail.com"
            with smtplib.SMTP(smtp_server, 587) as server:
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()
                server.login(sender_email, sender_password)
                server.sendmail(sender_email, receiver_email, message)

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
    dag_id="email_dag",
    schedule_interval="@daily",
    default_args=default_args,
    catchup=False
)

task = PythonOperator(
    task_id="send_learning_update",
    python_callable=send_email,
    provide_context=True,
    dag=dag
)