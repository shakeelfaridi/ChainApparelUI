import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BoxComp({ edit, setEdit, row, filteredData }) {
  const { id, filename, location } = row.row;
  console.log(row.row)
  //   const [open, setOpen] = React.useState(false);
  //   const handleOpen = () => setOpen(true);
  const [input, setInput] = React.useState({
    id: id,
    filename: filename,
    location: location,
  });
  const handleClose = () => setEdit(false);
  const handleChange = (evt) => {
    setInput({ ...input, [evt.target.name]: evt.target.value });
  };
  const handleSubmit = () => {
    filteredData[row.index] = input;
    handleClose();
  };
  console.log(input);
  return (
    <div>
      {/* <Button onClick={edit}>Open modal</Button> */}
      <Modal
        open={edit}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            onChange={handleChange}
            id="outlined-basic"
            label="id"
            variant="outlined"
            name="id"
            value={input.id}
          />
          <TextField
            onChange={handleChange}
            id="outlined-basic"
            label="Filename"
            variant="outlined"
            name="filename"
            value={input.filename}
          />
          <TextField
            onChange={handleChange}
            id="outlined-basic"
            label="Location"
            variant="outlined"
            name="location"
            value={input.location}
          />
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
          <Button onClick={handleClose} variant="contained">Close</Button>
        </Box>
      </Modal>
    </div>
  );
}
