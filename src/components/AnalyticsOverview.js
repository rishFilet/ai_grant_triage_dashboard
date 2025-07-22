import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Chip,
    Skeleton,
} from '@mui/material';
import {
    Assessment,
    Speed, CheckCircle,
    Schedule
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function AnalyticsOverview({ analytics, loading }) {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!analytics) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No analytics data available
        </Typography>
      </Box>
    );
  }

  const categoryData = Object.entries(analytics.category_distribution || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const statusData = [
    { name: 'Approved', value: analytics.approved_count || 0, color: '#4caf50' },
    { name: 'Under Review', value: analytics.under_review_count || 0, color: '#ff9800' },
    { name: 'Pending', value: (analytics.total_applications || 0) - (analytics.approved_count || 0) - (analytics.under_review_count || 0), color: '#2196f3' },
  ];

  const getRiskColor = (score) => {
    if (score <= 0.3) return '#4caf50';
    if (score <= 0.6) return '#ff9800';
    return '#f44336';
  };

  const getRiskLabel = (score) => {
    if (score <= 0.3) return 'Low';
    if (score <= 0.6) return 'Medium';
    return 'High';
  };

  return (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12} sm={6} md={3}>
        <Card className="card-hover">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assessment sx={{ color: '#1976d2', mr: 1 }} />
              <Typography variant="h6" component="div">
                Total Applications
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {analytics.total_applications || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Applications processed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="card-hover">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ color: '#4caf50', mr: 1 }} />
              <Typography variant="h6" component="div">
                Approved
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              {analytics.approved_count || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Applications approved
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="card-hover">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Speed sx={{ color: '#ff9800', mr: 1 }} />
              <Typography variant="h6" component="div">
                Time Saved
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
              {analytics.processing_time_saved || '80%'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Processing efficiency
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="card-hover">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Schedule sx={{ color: '#2196f3', mr: 1 }} />
              <Typography variant="h6" component="div">
                Hours Saved/Week
              </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              {analytics.hours_saved_per_week || 15}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Staff time saved
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Risk Assessment */}
      <Grid item xs={12} md={6}>
        <Card className="card-hover">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Assessment Overview
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Average Risk Score</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {analytics.avg_risk_score || 0}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(analytics.avg_risk_score || 0) * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: getRiskColor(analytics.avg_risk_score || 0),
                  },
                }}
              />
              <Chip
                label={getRiskLabel(analytics.avg_risk_score || 0)}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: getRiskColor(analytics.avg_risk_score || 0),
                  color: 'white',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Eligibility Score
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {(analytics.avg_eligibility_score || 0) * 100}%
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Completeness Score
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {(analytics.avg_completeness_score || 0) * 100}%
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Category Distribution */}
      <Grid item xs={12} md={6}>
        <Card className="card-hover">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Applications by Category
            </Typography>
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Status Distribution */}
      <Grid item xs={12}>
        <Card className="card-hover">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Application Status Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default AnalyticsOverview; 