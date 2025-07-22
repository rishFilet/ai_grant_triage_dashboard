import React, { useState, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Grid,
    Alert,
    Paper,
    Divider,
    Chip,
} from '@mui/material';

function ApplicationUpload({ onUploaded }) {
  const [uploadMethod, setUploadMethod] = useState('file');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleSubmit = async () => {
    if (uploadMethod === 'file' && !file) {
      setError('Please select a PDF file');
      return;
    }
    
    if (uploadMethod === 'text' && !text.trim()) {
      setError('Please enter application text');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      
      if (uploadMethod === 'file') {
        formData.append('file', file);
      } else {
        formData.append('text', text);
      }

      const requestBody = uploadMethod === 'file' ? formData : JSON.stringify({ text });
      const requestHeaders = uploadMethod === 'text' ? {
        'Content-Type': 'application/json',
      } : {};

      console.log('Sending request:', {
        method: 'POST',
        url: '/api/applications',
        body: uploadMethod === 'file' ? 'FormData' : JSON.stringify({ text }),
        headers: requestHeaders,
      });

      const response = await fetch('/api/applications', {
        method: 'POST',
        body: requestBody,
        headers: requestHeaders,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Response result:', result);
      setResult(result);
      onUploaded(result);
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Failed to upload application: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score <= 0.3) return '#4caf50';
    if (score <= 0.6) return '#ff9800';
    return '#f44336';
  };

  const getRiskLabel = (score) => {
    if (score <= 0.3) return 'Low Risk';
    if (score <= 0.6) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card className="card-hover">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload Grant Application
            </Typography>
            
            {/* Upload Method Toggle */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant={uploadMethod === 'file' ? 'contained' : 'outlined'}
                onClick={() => setUploadMethod('file')}
                sx={{ mr: 2 }}
              >
                Upload PDF
              </Button>
              <Button
                variant={uploadMethod === 'text' ? 'contained' : 'outlined'}
                onClick={() => setUploadMethod('text')}
              >
                Paste Text
              </Button>
            </Box>

            {uploadMethod === 'file' ? (
              <Box>
                <Paper
                  className={`upload-area ${isDragging ? 'dragover' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Drag & Drop PDF File
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    or click to browse
                  </Typography>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outlined" component="span">
                      Choose File
                    </Button>
                  </label>
                </Paper>
                
                {file && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                label="Paste application text here"
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={uploading || (uploadMethod === 'file' && !file) || (uploadMethod === 'text' && !text.trim())}
              fullWidth
            >
              {uploading ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Results */}
      <Grid item xs={12} md={6}>
        <Card className="card-hover">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              AI Analysis Results
            </Typography>
            
            {result ? (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="#4caf50">
                    Analysis Complete
                  </Typography>
                </Box>

                {/* Scores */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: getRiskColor(result.risk_score), fontWeight: 'bold' }}>
                        {(result.risk_score * 100).toFixed(0)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Risk Score
                      </Typography>
                      <Chip
                        label={getRiskLabel(result.risk_score)}
                        size="small"
                        sx={{
                          mt: 1,
                          bgcolor: getRiskColor(result.risk_score),
                          color: 'white',
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        {(result.eligibility_score * 100).toFixed(0)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Eligibility
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                        {(result.completeness_score * 100).toFixed(0)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completeness
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* AI Analysis Details */}
                <Typography variant="subtitle1" gutterBottom>
                  AI Analysis Details
                </Typography>
                
                {result.ai_analysis && (
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Eligibility Assessment
                      </Typography>
                      <Typography variant="body1">
                        {result.ai_analysis.eligibility}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Completeness Check
                      </Typography>
                      <Typography variant="body1">
                        {result.ai_analysis.completeness}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Risk Factors
                      </Typography>
                      <Typography variant="body1">
                        {result.ai_analysis.risk_factors}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Recommendations
                      </Typography>
                      <Typography variant="body1">
                        {result.ai_analysis.recommendations}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Budget Validation
                      </Typography>
                      <Typography variant="body1">
                        {result.ai_analysis.budget_validation}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Impact Assessment
                      </Typography>
                      <Typography variant="body1">
                        {result.ai_analysis.impact_assessment}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Upload an application to see AI analysis results
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ApplicationUpload; 