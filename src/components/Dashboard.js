import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box, Paper,
    Tabs,
    Tab,
    Chip,
    Avatar
} from '@mui/material';
import {
    Assessment,
    Upload,
    List, Download,
    Psychology
} from '@mui/icons-material';
import AnalyticsOverview from './AnalyticsOverview';
import ApplicationUpload from './ApplicationUpload';
import ApplicationList from './ApplicationList';
import ExportQueue from './ExportQueue';

function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const baseURL = process.env.REACT_APP_API_URL || '/api';
      const [analyticsRes, applicationsRes] = await Promise.all([
        fetch(`${baseURL}/analytics`),
        fetch(`${baseURL}/applications`),
      ]);
      
      const analyticsData = await analyticsRes.json();
      const applicationsData = await applicationsRes.json();
      
      setAnalytics(analyticsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleApplicationUploaded = (newApplication) => {
    setApplications([newApplication, ...applications]);
    fetchData(); // Refresh analytics
  };

  const tabConfig = [
    {
      label: 'Analytics Overview',
      icon: <Assessment />,
      component: <AnalyticsOverview analytics={analytics} loading={loading} />,
    },
    {
      label: 'Upload Applications',
      icon: <Upload />,
      component: <ApplicationUpload onUploaded={handleApplicationUploaded} />,
    },
    {
      label: 'Application List',
      icon: <List />,
      component: <ApplicationList applications={applications} loading={loading} />,
    },
    {
      label: 'Export Queue',
      icon: <Download />,
      component: <ExportQueue applications={applications} />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Psychology sx={{ mr: 2, color: '#1976d2' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1976d2', fontWeight: 600 }}>
            AI Grant Triage Dashboard
          </Typography>
          <Chip
            avatar={<Avatar sx={{ bgcolor: '#4caf50' }}>TAC</Avatar>}
            label="Toronto Arts Council"
            variant="outlined"
            sx={{ borderColor: '#1976d2', color: '#1976d2' }}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                },
              }}
            >
              {tabConfig.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 3, minHeight: '70vh' }}>
            {tabConfig[activeTab].component}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard; 