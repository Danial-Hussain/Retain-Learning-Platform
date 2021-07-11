import React from "react";
import {
  makeStyles,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TablePagination,
  TableFooter,
} from "@material-ui/core";
import { ArrowCircleUpIcon, ArrowCircleDownIcon } from "@heroicons/react/solid";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableHeaderCell: {
    fontWeight: "bold",
  },
  category: {
    fontWeight: "bold",
    fontSize: "0.7rem",
    color: "white",
    backgroundColor: "grey",
    borderRadius: 8,
    padding: "3px 10px",
    display: "inline-block",
    textAlign: "center",
  },
}));

function submitPodcast(row, rating) {
  fetch("/submitPodcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Title: row.Title,
      Publisher: row.Publisher,
      Category: row.Category,
      URL: row.URL,
      Description: row.Description,
      Duration: row.Duration,
      Rating: rating,
    }),
  });
}

function Row(props) {
  const { index, row } = props;
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const classes = useStyles();

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ArrowCircleUpIcon className="w-5 h-5 text-black" />
            ) : (
              <ArrowCircleDownIcon className="w-5 h-5 text-black" />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <a href={row.URL} className="underline font-semibold">
            {row.Title}
          </a>
        </TableCell>
        <TableCell align="right">{row.Publisher}</TableCell>
        <TableCell align="right">
          <Typography
            className={classes.category}
            style={{
              backgroundColor:
                (row.Category === "Data Science" && "#10B981") ||
                (row.Category === "Data Engineering" && "#1E40AF") ||
                (row.Category === "Quantitative Finance" && "#6366F1") ||
                (row.Category === "Software Engineering" && "#5B21B6"),
            }}
          >
            {row.Category}
          </Typography>
        </TableCell>
        <TableCell align="right">
          {Math.round(row.Duration / 60, 2)} minutes
        </TableCell>
        <TableCell align="right">
          <Rating
            key={index}
            defaultValue={rating}
            max={10}
            style={{ color: "#6EE7B7" }}
            onChange={(_, val) => {
              setRating(val);
            }}
            icon={<FiberManualRecordIcon fontSize="inherit" />}
          />
        </TableCell>
        <TableCell align="right">
          <button
            className="bg-green-800 bg-opacity-75 rounded-md p-2 border-2 border-black text-white hover:bg-opacity-25"
            onClick={() => submitPodcast(row, rating)}
          >
            Submit
          </button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
              <Typography variant="body" gutterBottom component="div">
                {row.Description}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function PodcastTable(props) {
  const { rows } = props;
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className={classes.tableHeaderCell}>
              Podcast Name
            </TableCell>
            <TableCell align="right" className={classes.tableHeaderCell}>
              Podcast Publisher
            </TableCell>
            <TableCell align="right" className={classes.tableHeaderCell}>
              Podcast Category
            </TableCell>
            <TableCell align="right" className={classes.tableHeaderCell}>
              Podcast Duration
            </TableCell>
            <TableCell align="right" className={classes.tableHeaderCell}>
              Podcast Rating
            </TableCell>
            <TableCell align="right" className={classes.tableHeaderCell}>
              Submit
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <Row key={index} row={row} index={index} />
            ))}
        </TableBody>
        <TableFooter>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            colSpan={3}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableFooter>
      </Table>
    </TableContainer>
  );
}