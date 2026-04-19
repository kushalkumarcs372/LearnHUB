import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    TextField,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Chip,
    Alert,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
    CloudUpload,
    Delete,
    CheckCircle,
    InsertDriveFile,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const MaterialUpload = ({ open, onClose, courseId, onSuccess }) => {
    const theme = useTheme();
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [materialData, setMaterialData] = useState({
        title: '',
        description: '',
    });
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-powerpoint': ['.ppt'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'text/plain': ['.txt'],
        },
        maxSize: 10485760, // 10MB
        multiple: false,
    });

    const handleRemoveFile = () => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
        setFiles([]);
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select a file');
            return;
        }
        if (!materialData.title.trim()) {
            setError('Please enter a title');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const file = files[0];
            const formData = new FormData();
            formData.append('courseId', String(courseId));
            formData.append('title', materialData.title);
            formData.append('description', materialData.description || '');
            formData.append('file', file);

            await api.post('/materials/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (evt) => {
                    const total = evt.total || file.size || 1;
                    const percent = Math.round((evt.loaded * 100) / total);
                    setUploadProgress(Math.max(0, Math.min(100, percent)));
                },
            });

            alert('Material uploaded successfully!');
            onSuccess?.();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleClose = () => {
        handleRemoveFile();
        setMaterialData({ title: '', description: '' });
        setError('');
        setUploadProgress(0);
        onClose();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    background: (theme) => theme.custom?.gradients?.primary,
                    color: 'white',
                }}
            >
                Upload Study Material
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Material Title"
                    value={materialData.title}
                    onChange={(e) => setMaterialData({ ...materialData, title: e.target.value })}
                    margin="normal"
                    required
                    placeholder="e.g., Chapter 1 - Introduction to React"
                />

                <TextField
                    fullWidth
                    label="Description (Optional)"
                    value={materialData.description}
                    onChange={(e) => setMaterialData({ ...materialData, description: e.target.value })}
                    margin="normal"
                    multiline
                    rows={2}
                    placeholder="Brief description of this material..."
                />

                <Box sx={{ mt: 3 }}>
                    {files.length === 0 ? (
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed',
                                borderColor: isDragActive
                                    ? theme.palette.primary.main
                                    : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.18),
                                borderRadius: 3,
                                p: 6,
                                textAlign: 'center',
                                cursor: 'pointer',
                                bgcolor: isDragActive
                                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.14 : 0.07)
                                    : theme.palette.mode === 'dark'
                                        ? alpha('#ffffff', 0.03)
                                        : '#fafafa',
                                transition:
                                    'border-color 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08),
                                },
                            }}
                        >
                            <input {...getInputProps()} />
                            <motion.div
                                animate={{
                                    y: isDragActive ? -10 : 0,
                                }}
                            >
                                <CloudUpload
                                    sx={{
                                        fontSize: 80,
                                        color: isDragActive ? theme.palette.primary.main : theme.palette.text.secondary,
                                        mb: 2,
                                    }}
                                />
                                <Typography variant="h6" gutterBottom>
                                    {isDragActive
                                        ? 'Drop your file here'
                                        : 'Drag & drop your file here'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    or click to browse
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chip
                                        label="PDF, DOC, DOCX, PPT, PPTX, TXT"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip label="Max 10MB" size="small" color="primary" />
                                </Box>
                            </motion.div>
                        </Box>
                    ) : (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <List>
                                    {files.map((file, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
                                                borderRadius: 2,
                                                mb: 1,
                                                border: `2px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.22 : 0.18)}`,
                                            }}
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    onClick={handleRemoveFile}
                                                    disabled={uploading}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemIcon>
                                                <InsertDriveFile sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={file.name}
                                                secondary={
                                                    <Box>
                                                        <Typography variant="caption" display="block">
                                                            {formatFileSize(file.size)}
                                                        </Typography>
                                                        {uploading && (
                                                            <Box sx={{ mt: 1 }}>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={uploadProgress}
                                                                    sx={{ height: 6, borderRadius: 3 }}
                                                                />
                                                                <Typography variant="caption" color="primary">
                                                                    Uploading: {uploadProgress}%
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </Box>

                {uploading && (
                    <Alert severity="info" icon={<CloudUpload />} sx={{ mt: 2 }}>
                        Uploading your material... Please don't close this window.
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose} disabled={uploading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                    startIcon={uploading ? <CloudUpload /> : <CheckCircle />}
                    sx={{
                        background: (theme) => theme.custom?.gradients?.primary,
                    }}
                >
                    {uploading ? `Uploading ${uploadProgress}%` : 'Upload Material'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MaterialUpload;
