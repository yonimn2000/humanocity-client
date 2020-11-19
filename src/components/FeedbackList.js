import React, { forwardRef, useEffect, useState } from 'react'
import MaterialTable from 'material-table'
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import { 
  AddBox,
  Clear,
  Search,
  FirstPage,
  LastPage,
  ChevronRight,
  ChevronLeft,
  ArrowDownward,
  Remove,
  ViewColumn} from '@material-ui/icons'
import { getAllFeedback, getAllEmployees } from '../api'

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

const FeedbackList = (props) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    getAllFeedback().then(response => {
      let feedbacks = response;
      getAllEmployees().then(names => {
        setFeedbackList(feedbacks.map(feedback => {
          const name = names.find(nm => nm.id === feedback.employeeId);
          return {...feedback, Name: name.firstName + ' ' + name.lastName, email: name.email};
        }))
      })
    })
  }, [])

  const handleClick = (id) => {
    setSelectedFeedback(feedbackList.find(fb => fb.feedbackId === id))
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
    <MaterialTable
      icons={tableIcons}
      localization={{
        header: {
          actions: 'Selection'
        },
      }}
      title="Feedback"
      columns={[
        {
          title: 'Employee',
          field: 'Name',
          headerStyle: {
            backgroundColor: '#6C6FA5',
            color: '#ffffff'
          }
        },
        {
          title: 'Category',
          field: 'type',
          headerStyle: {
            backgroundColor: '#6C6FA5',
            color: '#ffffff'
          }
        },
      ]}
      data={feedbackList}
      actions={[
        {
          icon: props => (
            <Button
              color= "primary"
              variant="contained"
              style={{backgroundColor: 'green'}}
              size="small"
            >
              View
            </Button>),
          tooltip: 'View feedback',
          onClick: (event, rowData) => handleClick(rowData.feedbackId)
        },
        {
          icon: props => (
            <Button
              color="secondary"
              variant="contained"
              style={{backgroundColor: 'red'}}
              size="small"
            >
              Dismiss
              </Button>),
          tooltip: 'Dismiss',
          onClick: (event, rowData) => handleClick(rowData.ID)
        }
      ]}
      options={{
        actionsColumnIndex: -1,
        headerStyle: {
          backgroundColor: '#6C6FA5',
          color: '#ffffff'
      }}}
    />
    {selectedFeedback === null ? <div/> :
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
      {`${selectedFeedback.type} from ${selectedFeedback.Name}`}
    </DialogTitle>
    <DialogContent dividers>
      <Typography gutterBottom>
        {selectedFeedback.description}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={handleClose} color="primary">
        Close
      </Button>
      <Button autoFocus  variant='contained' onClick={()=> window.open("mailto:" + selectedFeedback.email, "_blank")} color="primary">
        Email Employee
      </Button>
    </DialogActions>
  </Dialog>
}
  </React.Fragment>
  )
}

export default FeedbackList