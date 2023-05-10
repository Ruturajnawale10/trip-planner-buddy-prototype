import React from "react";
import { IconButton } from "@mui/material";
import { Typography } from "@mui/material";
import Link from "@mui/material/Link";

import getRelativeTime from "../../utils/getRelativeTime";
export default function CardUserInfo(props){

    let { profileImageURL, userId, username, reputation, type, askedOn} = props.data;
    askedOn = getRelativeTime(askedOn, new Date().toISOString());
    return(
        // <div>
        //     Hellof
        // </div>

        <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center" }}>
            
              <img
                src={profileImageURL}
                alt="Site Logo"
                width="16"
                height="16"
              />
              <Link href={"/users/profile/"+userId} underline="none" color="#0074CC" sx={{ "& :hover": { color: "#0A95FF" }}}>
                  <Typography
                    variant="body1"
                    
                    component="div"
                    sx={{
                      display: { xs: "none", sm: "inline-block" },
                    //   color: "#0074CC",
                      fontFamily:
                        '-apple-system,BlinkMacSystemFont,"Segoe UI Adjusted","Segoe UI","Liberation Sans",sans-serif',
                      marginLeft: "5px",
                      fontSize: "12px",
                    wordWrap:"wrap",
                    wordBreak: "break-all"
                    }}
                    textTransform="none"
                  >
                    {username}
                  </Typography>
                  </Link>
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
                {reputation}
              </Typography>
              <Typography
                variant="body2"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "inline-block" },
                  color: "#6A737C",
                  fontFamily:
                    '"-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                  fontSize: "12px",
                  marginLeft: "5px",
                }}
                textTransform="none"
              >
                {type} {askedOn}
              </Typography>
            
        </div>
    );
}