import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { borders, width } from "@mui/system";

import { AppBar, FormControl, Toolbar } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { Typography } from "@mui/material";
import { Link } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import SearchbarTooltip from "./SearchbarTooltip";
import { InputLabel } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import { blue } from "@mui/material/colors";
import { withTheme } from "@emotion/react";

import InboxIcon from "@mui/icons-material/Inbox";
import Sidebar from "./MiniSidebar";

import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions";
import axios from "axios";
import STRINGS from "../../constant";
//Configuring Style for SearchBar Elements
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  color: "black",
  border: "1px solid lightgrey",
  borderRadius: "3px",
  backgroundColor: "white",
  // "&:hover": {
  //   backgroundColor: "#F0EEE9",
  // },

  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  padding: "0px",
  width: "auto",
  display: "flex",
  alignItems: "center",
  direction: "row",
  flexWrap: "wrap",
  justifyContent: "flex-start",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    //   paddingLeft: `calc(1em + ${theme.spacing(0)})`,
    paddingLeft: "0px",
    transition: theme.transitions.create("width"),
    width: "100%",
    // [theme.breakpoints.up('md')]: {
    //   width: '20ch',
    // },
  },
}));

const SearchIconButton = styled(IconButton)(({ theme }) => ({
  size: "large",
  float: "right",
  // aria-label: "show 4 new mails",
  color: "grey",
  width: "auto",
  fontWeight: "bold",
  textAlign: "center",
  // padding: theme.spacing(0, 2),
  // height: '100%',
  // position: 'absolute',
  // pointerEvents: 'none',
  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'center',
  // color: "black"
}));

const BootstrapInput = styled(TextField)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
    {
      // '&:focus': {
      //boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      border: "1px solid #1976d2",
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
      //   },
    },
  marginLeft: "5px",
  marginRight: "15px",
  // border: '1px solid #ced4da',
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",

    fontSize: 14,
    width: "100%",
    //   maxWidth: '100%',
    padding: "10px 2px 10px 2px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
}));

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
  },
  width: "auto",
}));

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[500]),
  backgroundColor: blue[500],
  "&:hover": {
    backgroundColor: blue[700],
  },
}));

export default function Navbar(props) {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const setLogout = () => {
    dispatch(logout());
    navigate("/home");
  };

  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const loggedInUser = useSelector((state) => state.LoggedInUser);
  
  const goldCount = loggedInUser?.badges?.filter((x) => x.type === "gold") ? loggedInUser?.badges?.filter((x) => x.type === "gold").length : 0;
  const silverCount = loggedInUser?.badges?.filter((x) => x.type === "silver") ? loggedInUser?.badges?.filter((x) => x.type === "silver").length : 0;
  const bronzeCount = loggedInUser?.badges?.filter((x) => x.type === "bronze") ? loggedInUser?.badges?.filter((x) => x.type === "bronze").length : 0;
  

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenu2Open = Boolean(anchorEl2);
  const handleProfileMenu2Open = (event) => {
    if (anchorEl2) {
      setAnchorEl2(null);
    } else {
      setAnchorEl2(event.currentTarget);
    }
  };
  const handleMenu2Close = () => {
    setAnchorEl2(null);
  };

  const setComponent = (value) => {
    setTabValue(value);
    if (value == 0) {
      //it is home page
      var url = "/home";

      navigate(url);
    } else if (value == 2) {
      //it is question page
      var url = "/question";

      navigate(url);
    } else if (value == 3) {
      //it is tags page
      var url = "/tags";

      navigate(url);
    } else if (value == 4) {
      //it is users page
      var url = "/users";

      navigate(url);
    }
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      position="relative"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Sidebar setComponent={setComponent} tabValue={0} />
    </Menu>
  );

  const menuId2 = "primary-search-account-menu-2";
  const renderMenu2 = (
    <Menu
      position="relative"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId2}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenu2Open}
      onClose={handleMenu2Close}
    >
      <MenuItem onClick={() => setLogout()}>Logout</MenuItem>
    </Menu>
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const submitSearch = (e) => {
    console.log(e.keyCode);
    if(e.keyCode === 13){
      if(searchQuery == null || searchQuery == ""){
        alert("Enter somehting to search");
      }
      else{
        // console.log("in search")
        // setSearchQuery(searchQuery.trim());
        // if(!searchQuery.includes(":") && !searchQuery.includes('"') && searchQuery.includes("[")){
        //   // searchQuery = searchQuery.replace("[","");
        //   // searchQuery = searchQuery.replace("]","");
        //   var url = "/question/tagged/" + searchQuery;
        //   navigate(url);
        // }else{
          var url = "/search/" + searchQuery;
          navigate(url);
        // }
      }
  }
  }
  return (
    <div>
      {/* <Box sx={{ flexGrow: 1 }}> */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        style={{
          borderTop: "5px solid orange",
          backgroundColor: "white",
          paddingLeft: "1%",
          paddingRight: "1%",
          paddingTop: "0px",
          paddingBottom: "0px",
        }}
      >
        <Toolbar
          style={{
            paddingTop: "0px",
            paddingBottom: "0px",
            minHeight: "0px",
            paddingRight: "0px",
          }}
        >
          {/* Navbar Menu Button         */}
          {isLoggedIn == false ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              style={{
                borderRadius: "0px",
                marginTop: "0px",
                marginBottom: "0px",
              }}
              sx={{
                mr: 2,
                "&:hover": {
                  backgroundColor: "grey",
                },
              }}
              onClick={handleProfileMenuOpen}
            >
              {anchorEl === null ? (
                <MenuIcon sx={{ color: "black", height: "30px" }} />
              ) : (
                <CloseIcon sx={{ color: "black", height: "30px" }} />
              )}

              {renderMenu}
            </IconButton>
          ) : null}

          {/* Navbar Site Logo */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            style={{
              borderRadius: "0px",
              marginTop: "0px",
              marginBottom: "0px",
              marginRight: "0px",
            }}
            sx={{
              mr: 2,
              "&:hover": {
                backgroundColor: "grey",
              },
            }}
            onClick={() => {
              isLoggedIn ? navigate("/home") : navigate("/");
            }}
          >
            <img
              src="https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.png"
              alt="Site Logo"
              width="150"
              height="30"
            />
          </IconButton>

          {isLoggedIn == false ? (
            <Box
              sx={{ display: { xs: "none", md: "flex" } }}
              style={{ margin: "0px" }}
            >
              <Button
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                style={{
                  borderRadius: "24px",
                  marginTop: "5px",
                  fontFamily:
                    '-apple-system,BlinkMacSystemFont,"Segoe UI Adjusted","Segoe UI","Liberation Sans",sans-serif',
                  fontWeight: "bold",
                }}
                //   onClick={openLoginDialog}
              >
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    color: "#525960",
                  }}
                  textTransform="capitalize"
                >
                  About
                </Typography>
              </Button>
            </Box>
          ) : null}

          <Box
            sx={{ display: { xs: "none", md: "flex" } }}
            style={{ margin: "0px" }}
          >
            <Button
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              style={{
                borderRadius: "24px",
                marginTop: "5px",
                fontFamily:
                  '-apple-system,BlinkMacSystemFont,"Segoe UI Adjusted","Segoe UI","Liberation Sans",sans-serif',
                fontWeight: "bold",
              }}
              //   onClick={openLoginDialog}
            >
              <Typography
                variant="body2"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "block" },
                  color: "#525960",
                }}
                textTransform="capitalize"
              >
                Products
              </Typography>
            </Button>
          </Box>

          {isLoggedIn == false ? (
            <Box
              sx={{ display: { xs: "none", md: "flex" } }}
              style={{ margin: "0px" }}
            >
              <Button
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                style={{
                  borderRadius: "24px",
                  marginTop: "5px",
                  fontFamily:
                    '-apple-system,BlinkMacSystemFont,"Segoe UI Adjusted","Segoe UI","Liberation Sans",sans-serif',
                  fontWeight: "bold",
                }}
                //   onClick={openLoginDialog}
              >
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    color: "#525960",
                  }}
                  textTransform="capitalize"
                >
                  For Teams
                </Typography>
              </Button>
            </Box>
          ) : null}

          {/* <Box sx={{ flexGrow: 1, textAlign: "left" }} > */}
          {/* <Search>
            
            <SearchIconButton>
                <SearchIcon style={{ marginLeft: "8px", marginRight: "5px", color: "lightgrey" }}/>
              </SearchIconButton>
              <StyledInputBase
                placeholder="Search..."
                inputProps={{ "aria-label": "search" }}
                // onChange={updateSearchString}
                style={{ width: "90%" }}
              />
            </Search> */}
          <BootstrapTooltip
            title={
              <React.Fragment>
                <SearchbarTooltip />
              </React.Fragment>
            }
            width="600"
            disableHoverListener
          >
            <FormControl
              style={{ width: "100%" }}
              variant="standard"
              sx={{ flexGrow: 1 }}
            >
              <BootstrapInput
                defaultValue={searchQuery}
                placeholder="Search..."
                id="bootstrap-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ paddingLeft: "0px" }}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onKeyDown={(e) => submitSearch(e)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </FormControl>
          </BootstrapTooltip>

          {!isLoggedIn ? (
            <Button
              variant="outlined"
              sx={{
                minWidth: "100px",
                lineHeight: "2",
                marginRight: "5px",
                textTransform: "none",
                color: "#39739D",
                backgroundColor: "#E1ECF4",
                borderColor: "#7AA7C7",
                "&:hover": { color: "#1976D2", backgroundColor: "#E3F2FD" },
              }}
              onClick={() => {
                navigate("/login");
              }}
            >
              Log In
            </Button>
          ) : null}

          {!isLoggedIn ? (
            <Button
              variant="outlined"
              sx={{
                minWidth: "100px",
                lineHeight: "2",
                textTransform: "none",
                color: "#FFFFFF",
                backgroundColor: "#0A95FF",
                borderColor: "#7AA7C7",
                "&:hover": { color: "#FFFFFF", backgroundColor: "#0074CC" },
              }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </Button>
          ) : null}

          {isLoggedIn ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              style={{
                borderRadius: "0px",
                marginTop: "0px",
                marginBottom: "0px",
                marginRight: "0px",
                marginLeft: "0px",
              }}
              sx={{
                mr: 2,
                "&:hover": {
                  backgroundColor: "grey",
                },
              }}
              onClick={() => navigate('/users/profile/' + loggedInUser._id)}
            >
              <img
                src={loggedInUser["profilePicture"] ? loggedInUser["profilePicture"] : "https://www.gravatar.com/avatar/c0bc039e1fa3c0e09e4c69a6d0a8c7bf?s=48&d=identicon&r=PG&f=1"}
                alt="Site Logo"
                width="24"
                height="24"
              />
              <Typography
                variant="body2"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "inline-block" },
                  color: "#525960",
                  fontFamily:
                    '"-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
                textTransform="none"
              >
                {loggedInUser.reputation}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "inline-block" },
                  color: "#f0b400",
                  fontFamily:
                    '"-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
                textTransform="none"
              >
                {"\u2022"} {goldCount}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "inline-block" },
                  color: "#999c9f",
                  fontFamily:
                    '"-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
                textTransform="none"
              >
                {"\u2022"} {silverCount}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "inline-block" },
                  color: "#ab825f",
                  fontFamily:
                    '"-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
                textTransform="none"
              >
                {"\u2022"} {bronzeCount}
              </Typography>
            </IconButton>
          ) : null}

          {isLoggedIn ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              style={{
                borderRadius: "0px",
                marginTop: "0px",
                marginBottom: "0px",
                marginRight: "0px",
                marginLeft: "0px",
              }}
              sx={{
                mr: 2,
                "&:hover": {
                  backgroundColor: "grey",
                },
              }}
              
            >
              {/* inbox */}
              <svg
                aria-hidden="true"
                className="svg-icon iconInbox"
                width="20"
                height="18"
                viewBox="0 0 20 18"
              >
                <path d="M4.63 1h10.56a2 2 0 0 1 1.94 1.35L20 10.79V15a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-4.21l2.78-8.44c.25-.8 1-1.36 1.85-1.35Zm8.28 12 2-2h2.95l-2.44-7.32a1 1 0 0 0-.95-.68H5.35a1 1 0 0 0-.95.68L1.96 11h2.95l2 2h6Z"></path>
              </svg>
            </IconButton>
          ) : null}

          {isLoggedIn ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              style={{
                borderRadius: "0px",
                marginTop: "0px",
                marginBottom: "0px",
                marginRight: "0px",
                marginLeft: "0px",
              }}
              sx={{
                mr: 2,
                "&:hover": {
                  backgroundColor: "grey",
                },
              }}
            >
              {/* trophy */}
              <svg
                aria-hidden="true"
                className="svg-icon iconAchievements"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M15 2V1H3v1H0v4c0 1.6 1.4 3 3 3v1c.4 1.5 3 2.6 5 3v2H5s-1 1.5-1 2h10c0-.4-1-2-1-2h-3v-2c2-.4 4.6-1.5 5-3V9c1.6-.2 3-1.4 3-3V2h-3ZM3 7c-.5 0-1-.5-1-1V4h1v3Zm8.4 2.5L9 8 6.6 9.4l1-2.7L5 5h3l1-2.7L10 5h2.8l-2.3 1.8 1 2.7h-.1ZM16 6c0 .5-.5 1-1 1V4h1v2Z"></path>
              </svg>
            </IconButton>
          ) : null}

          {isLoggedIn ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              style={{
                borderRadius: "0px",
                marginTop: "0px",
                marginBottom: "0px",
                marginRight: "0px",
                marginLeft: "0px",
              }}
              sx={{
                mr: 2,
                "&:hover": {
                  backgroundColor: "grey",
                },
              }}
            >
              {/* question */}
              <svg
                aria-hidden="true"
                className="svg-icon iconHelp"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M9 1C4.64 1 1 4.64 1 9c0 4.36 3.64 8 8 8 4.36 0 8-3.64 8-8 0-4.36-3.64-8-8-8Zm.81 12.13c-.02.71-.55 1.15-1.24 1.13-.66-.02-1.17-.49-1.15-1.2.02-.72.56-1.18 1.22-1.16.7.03 1.2.51 1.17 1.23ZM11.77 8c-.59.66-1.78 1.09-2.05 1.97a4 4 0 0 0-.09.75c0 .05-.03.16-.18.16H7.88c-.16 0-.18-.1-.18-.15.06-1.35.66-2.2 1.83-2.88.39-.29.7-.75.7-1.24.01-1.24-1.64-1.82-2.35-.72-.21.33-.18.73-.18 1.1H5.75c0-1.97 1.03-3.26 3.03-3.26 1.75 0 3.47.87 3.47 2.83 0 .57-.2 1.05-.48 1.44Z"></path>
              </svg>
            </IconButton>
          ) : null}

          {isLoggedIn ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              style={{
                borderRadius: "0px",
                marginTop: "0px",
                marginBottom: "0px",
                marginRight: "0px",
                marginLeft: "0px",
              }}
              sx={{
                mr: 2,
                "&:hover": {
                  backgroundColor: "grey",
                },
              }}
              onClick={handleProfileMenu2Open}
            >
              {renderMenu2}
              {/* stackexchange */}
              <svg
                aria-hidden="true"
                className="svg-icon iconStackExchange"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M15 1H3a2 2 0 0 0-2 2v2h16V3a2 2 0 0 0-2-2ZM1 13c0 1.1.9 2 2 2h8v3l3-3h1a2 2 0 0 0 2-2v-2H1v2Zm16-7H1v4h16V6Z"></path>
              </svg>
            </IconButton>
          ) : null}
        </Toolbar>
      </AppBar>
      {/* </Box> */}
      {/* <div><Sidebar /></div> */}
    </div>
  );
}
