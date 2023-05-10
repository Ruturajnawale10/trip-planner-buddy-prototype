import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import PublicIcon from "@mui/icons-material/Public";
import { height } from "@mui/system";
import { Divider } from "@mui/material";

import { useNavigate } from "react-router";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  tabs: {
    "& button:hover":{
      backgroundColor:"white",
      color: "#0C0D0E"
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "orange",
    },
    "& .publicTab": {
      fontSize: "11px",
      textTransform: "capitalize",
      color: "#6A737C",
      marginTop: "5px",
    },
    "& .normalTab": {
      fontSize: "13px",
      color: "#525960",
      textTransform: "none",
    },
    "& .MuiButtonBase-root.MuiTab-root": {
      alignItems: "flex-start",
      fontFamily:
        '"-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
      minHeight: "0px",
      height: "33px",
      justifyContent: "flex-start",
      // textAlign: "left"
    },

    "& .MuiButtonBase-root.MuiTab-root.Mui-selected": {
      color: "#0C0D0E",
      fontWeight: "bold",
    },
    // "& .nav-links .nav-links--link:hover": {
    //   color: "#0C0D0E",
    // },
  },
  publicTab: {
    fontSize: "50px",
  },
}));

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function Sidebar(props) {
  const classes = useStyles();
  var currentURL = window.location.pathname;
  var tabValue = null;
  if(currentURL.startsWith("/home")){
    tabValue = 0;
  }
  else if(currentURL.startsWith("/question")){
    tabValue = 2;
  }
  else if(currentURL.startsWith("/tags")){
    tabValue = 3;
  }
  else if(currentURL.startsWith("/users")){
    tabValue = 4;
  }

  const [value, setValue] = React.useState(tabValue);

  let navigate = useNavigate();
  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
    var url;
    if (newValue === 0) {
      //it is home page
       url = "/home";
      
    } else if (newValue === 2) {
      //it is question page
       url = "/question";
      
    } else if (newValue === 3) {
      //it is tags page
       url = "/tags";
  
    } else if (newValue === 4) {
      //it is users page
       url = "/users";
      
      
    }
    console.log(url);
    navigate(url);
    window.location.reload(false);
    //props.setComponent(newValue);
    // this.props.history.push('/tags');
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
        justifyContent: "flex-end",
      }}
    >
      <Tabs
        id="sidebar"
        orientation="vertical"
        value={value}
        // onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 0, borderColor: "divider", width: "150px" }}
        className={classes.tabs}
        style={{
          
        }}
        
      >
        <Tab label="Home" value={0} className="normalTab" {...a11yProps(0)} onClick={() => navigate('/home')}/>

        <Tab
          label="PUBLIC"
          value={1}
          className="publicTab"
          {...a11yProps(4)}
          disabled
          
        />
        <Tab
          label="Question"
          value={2}
          className="normalTab"
          icon={<PublicIcon />}
          iconPosition="start"
          {...a11yProps(1)}
          onClick={() => navigate('/question')}
        />
        <Tab
          label="Tags"
          value={3}
          className="normalTab"
          icon={<PublicIcon style={{ visibility: "hidden" }} />}
          iconPosition="start"
          {...a11yProps(2)}
          onClick={() => navigate('/tags')}
        />
        <Tab
          label="Users"
          value={4}
          className="normalTab"
          icon={<PublicIcon style={{ visibility: "hidden" }} />}
          iconPosition="start"
          {...a11yProps(3)}
          onClick={() => navigate('/users')}
        />
      </Tabs>
      {/* <Divider flexItem orientation="vertical"/> */}
    </Box>
  );
}
