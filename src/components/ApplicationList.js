import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Visibility, Psychology
} from '@mui/icons-material';

function ApplicationList({ applications, loading }) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#4caf50';
      case 'Under Review':
        return '#ff9800';
      case 'Rejected':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Grant Applications ({applications.length})
        </Typography>
        <Chip
          icon={<Psychology />}
          label="AI-Powered Analysis"
          color="primary"
          variant="outlined"
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Organization</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Project Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Risk Score</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Submitted</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow
                key={application.id}
                sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}
              >
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {application.organization}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {application.neighborhood}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {application.project_title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={application.category}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${application.requested_amount?.toLocaleString() || '0'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: getRiskColor(application.risk_score),
                        fontWeight: 'bold',
                        mr: 1,
                      }}
                    >
                      {(application.risk_score * 100).toFixed(0)}%
                    </Typography>
                    <Chip
                      label={getRiskLabel(application.risk_score)}
                      size="small"
                      sx={{
                        bgcolor: getRiskColor(application.risk_score),
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(application.status),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(application.submitted_date).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(application)}
                      sx={{ color: '#1976d2' }}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Application Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedApplication && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Psychology sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6">
                  Application Details - {selectedApplication.organization}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Basic Information
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Organization
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedApplication.organization}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Project Title
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {selectedApplication.project_title}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Category
                        </Typography>
                        <Chip
                          label={selectedApplication.category}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Requested Amount
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                          ${selectedApplication.requested_amount?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Neighborhood
                        </Typography>
                        <Typography variant="body1">
                          {selectedApplication.neighborhood}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Scores */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        AI Analysis Scores
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              variant="h4"
                              sx={{
                                color: getRiskColor(selectedApplication.risk_score),
                                fontWeight: 'bold',
                              }}
                            >
                              {(selectedApplication.risk_score * 100).toFixed(0)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Risk Score
                            </Typography>
                            <Chip
                              label={getRiskLabel(selectedApplication.risk_score)}
                              size="small"
                              sx={{
                                mt: 1,
                                bgcolor: getRiskColor(selectedApplication.risk_score),
                                color: 'white',
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              variant="h4"
                              sx={{ color: '#4caf50', fontWeight: 'bold' }}
                            >
                              {(selectedApplication.eligibility_score * 100).toFixed(0)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Eligibility
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              variant="h4"
                              sx={{ color: '#2196f3', fontWeight: 'bold' }}
                            >
                              {(selectedApplication.completeness_score * 100).toFixed(0)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Completeness
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              variant="h4"
                              sx={{ color: getStatusColor(selectedApplication.status), fontWeight: 'bold' }}
                            >
                              {selectedApplication.status}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Status
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* AI Analysis Details */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        AI Analysis Details
                      </Typography>
                      {selectedApplication.ai_analysis && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Eligibility Assessment
                              </Typography>
                              <Typography variant="body1">
                                {selectedApplication.ai_analysis.eligibility}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Completeness Check
                              </Typography>
                              <Typography variant="body1">
                                {selectedApplication.ai_analysis.completeness}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Risk Factors
                              </Typography>
                              <Typography variant="body1">
                                {selectedApplication.ai_analysis.risk_factors}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Recommendations
                              </Typography>
                              <Typography variant="body1">
                                {selectedApplication.ai_analysis.recommendations}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Budget Validation
                              </Typography>
                              <Typography variant="body1">
                                {selectedApplication.ai_analysis.budget_validation}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Impact Assessment
                              </Typography>
                              <Typography variant="body1">
                                {selectedApplication.ai_analysis.impact_assessment}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default ApplicationList; 