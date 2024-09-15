/* eslint-disable */
import { useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Box,
  Stack,
  Divider,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListItem,
  List,
  Toolbar,
  Drawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";

import "./Sidebar.css";
import { Link } from "@mui/material";

const drawerWidth = 300;

export default function ClippedDrawer({ mobileOpen, handleDrawerToggle }) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const navigate = useNavigate();
  const { id } = useParams();

  const { electives } = useSelector((store) => store.electiveList);
  const { majors } = useSelector((store) => store.majorList);

  const [open, setOpen] = useState({});

  const handleDropdown = (doc_id) => {
    setOpen((prevState) => ({
      ...prevState,
      [doc_id]: !prevState[doc_id],
    }));
  };

  const handleElectiveSelected = (electiveId) => {
    if (!electiveId) return;
    navigate(`/elective/${electiveId}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        hideBackdrop={true}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
          disableScrollLock: true,
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/home")}>
                <ListItemIcon>
                  <HomeOutlinedIcon sx={{ marginLeft: "30%" }} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            {majors.map((major) => (
              <div key={major.doc_id}>
                <ListItemButton onClick={() => handleDropdown(major.doc_id)}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={major.majorName} />
                  {open[major.doc_id] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open[major.doc_id]} timeout="auto" unmountOnExit>
                  <List key={major.doc_id} component="div" disablePadding>
                    {electives
                      .filter((elective) =>
                        elective.major.includes(major.doc_id)
                      )
                      .map((elective) => (
                        <ListItemButton
                          className="dropdown-item"
                          sx={{
                            pl: 4,
                            backgroundColor:
                              id === elective.courseNumber
                                ? "#F0F0F0"
                                : "inherit",
                          }}
                          key={elective.doc_id}
                          onClick={() => {
                            handleElectiveSelected(elective.courseNumber);
                          }}
                        >
                          <ListItemIcon></ListItemIcon>
                          <ListItemText primary={elective.courseName} />
                        </ListItemButton>
                      ))}
                  </List>
                </Collapse>
              </div>
            ))}
          </List>
        </Box>
        <Stack
          sx={{ height: 100, borderTop: 0.5 }}
          alignItems="center"
          justifyContent="center"
        >
          <Link onClick={() => navigate("/request")} sx={{ cursor: "pointer" }}>
            <Typography variant="body2">
              Didn&apos;t find your major/elective?
            </Typography>
          </Link>
        </Stack>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
