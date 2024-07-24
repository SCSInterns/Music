import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Hidden from '@mui/material/Hidden';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles'; 
import MenuIcon from '@mui/icons-material/Menu'; 
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import Token from '../Token/Token';

export default function ResponsiveDrawer() {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [email, setEmail] = useState([]);
  const username = sessionStorage.getItem('name')
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const adminusername = sessionStorage.getItem('name')
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const navigate = useNavigate() ; 
  

  const DrawerList = (
    <Box sx={{ width: drawerWidth }} role="presentation" onClick={handleDrawerToggle} >
      <List> 
        <AccountCircleRoundedIcon fontSize='large' sx={{ 
          marginTop:'20px' , width:'100px' , height:'100px'
        }}/>
          <Typography> Admin Name :  
            <br/>{adminusername}</Typography>
      </List>
      <Divider/>
      <List sx={{marginTop:'30px'}}>
        {['New Request', 'Registered Academy'].map((text, index) => (
          <ListItem key={text} disablePadding sx={{padding:'2px' , marginBottom:'20px', borderBottom:'2px solid black'}}>
            <ListItemButton  onClick={() => navigate(index % 2 === 0 ? '/superadmin/newrequest' : '/registered-academy')}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div style={{backgroundColor:"#0f1b27"}}>
    <Box sx={{ display: 'flex' }} className="bg-gray-700">
      <Hidden smDown>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          {DrawerList}
        </Drawer>
      </Hidden>
      <Hidden smUp>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box', 
            },
          }}
        >
          {DrawerList}
        </Drawer>
      </Hidden>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Button onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
           <MenuIcon sx={{display:'flex' }}/>
        </Button>
        {/* Main content goes here */}
      </Box>
    </Box>
    </div>
  );
}
