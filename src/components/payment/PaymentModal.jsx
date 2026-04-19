import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Card,
    CardContent,
    Divider,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import {
    CreditCard,
    AccountBalance,
    QrCode2,
    Lock,
    CheckCircle,
    Close,
} from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import { guideService } from '../../services/guideService';

const PaymentModal = ({
                          open,
                          onClose,
                          courseId,
                          instructorId,
                          topic,
                          description,
                          amount = 999,
                          onSuccess,
                      }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
        upiId: '',
        bank: '',
    });

    const steps = ['Payment Method', 'Payment Details', 'Confirmation'];

    const paymentMethods = [
        { value: 'UPI', label: 'UPI', icon: <QrCode2 /> },
        { value: 'CARD', label: 'Credit/Debit Card', icon: <CreditCard /> },
        { value: 'NET_BANKING', label: 'Net Banking', icon: <AccountBalance /> },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            const cleaned = value.replace(/\s/g, '');
            const formatted =
                cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;

            setFormData({ ...formData, [name]: formatted });
            return;
        }

        if (name === 'expiry') {
            const cleaned = value.replace(/\D/g, '');
            setFormData({
                ...formData,
                [name]:
                    cleaned.length >= 2
                        ? `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
                        : cleaned,
            });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleNext = () => {
        if (activeStep === 0) {
            setActiveStep(1);
            return;
        }

        if (activeStep === 1) {
            if (
                paymentMethod === 'CARD' &&
                (!formData.cardNumber ||
                    !formData.cardName ||
                    !formData.expiry ||
                    !formData.cvv)
            ) {
                setError('Please fill all card details');
                return;
            }

            if (paymentMethod === 'UPI' && !formData.upiId) {
                setError('Please enter UPI ID');
                return;
            }

            if (paymentMethod === 'NET_BANKING' && !formData.bank) {
                setError('Please select a bank');
                return;
            }

            setError('');
            setActiveStep(2);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
        setError('');
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            if (!courseId || !instructorId) {
                setError('Course or instructor not found.');
                return;
            }
            if (!topic?.trim()) {
                setError('Please enter a topic for the session.');
                return;
            }

            const res = await guideService.bookPaidSession({
                courseId,
                instructorId,
                topic,
                description,
                paymentMethod,
                amount,
            });

            const status = res?.data?.status;
            if (!status || status !== 'COMPLETED') {
                throw new Error('Payment failed. Please try again.');
            }

            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Payment failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setActiveStep(0);
        setPaymentMethod('UPI');
        setFormData({
            cardNumber: '',
            cardName: '',
            expiry: '',
            cvv: '',
            upiId: '',
            bank: '',
        });
        setError('');
        setSuccess(false);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
        >
            {/* Title */}
            <DialogTitle
                sx={{
                    background:
                        (theme) => theme.custom?.gradients?.primary,
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock />
                    <Typography variant="h6" fontWeight="bold">
                        Secure Payment
                    </Typography>
                </Box>

                <Button
                    onClick={handleClose}
                    sx={{ color: 'white', minWidth: 'auto', p: 0.5 }}
                >
                    <Close />
                </Button>
            </DialogTitle>

            {/* Content */}
            <DialogContent sx={{ p: 3 }}>
                <AnimatePresence mode="wait">
                    {!success ? (
                        <motion.div
                            key="payment-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Stepper */}
                            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {/* Amount Card */}
                            <Card
                                sx={{
                                    mb: 3,
                                    background: (theme) =>
                                        `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${alpha(
                                            theme.palette.secondary.main,
                                            0.10
                                        )} 100%)`,
                                    border: (theme) => `2px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.40 : 0.32)}`,
                                }}
                            >
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        1-on-1 Doubt Session Booking
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                        color="primary"
                                    >
                                        ₹{amount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Pay for this session request. Course content & quiz remain free.
                                    </Typography>
                                </CardContent>
                            </Card>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {/* Step Content */}
                            <Box sx={{ mt: 2 }}>
                                {activeStep === 0 && (
                                    <Box sx={{ display: 'grid', gap: 1.5 }}>
                                        {paymentMethods.map((method) => (
                                            <Card
                                                key={method.value}
                                                onClick={() => setPaymentMethod(method.value)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: 2,
                                                    border: '2px solid',
                                                    borderColor:
                                                        paymentMethod === method.value
                                                            ? 'primary.main'
                                                            : (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.28 : 0.18),
                                                    bgcolor:
                                                        paymentMethod === method.value
                                                            ? (theme) => alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.08)
                                                            : 'background.paper',
                                                    transition:
                                                        'transform 180ms cubic-bezier(0.16, 1, 0.3, 1), border-color 180ms cubic-bezier(0.16, 1, 0.3, 1), background-color 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        borderColor: 'primary.main',
                                                        boxShadow: (theme) => theme.custom?.shadows?.card,
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box sx={{ color: 'primary.main' }}>{method.icon}</Box>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography fontWeight={800}>{method.label}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {method.value === 'UPI'
                                                                ? 'Fast and easy UPI payment'
                                                                : method.value === 'CARD'
                                                                    ? 'Pay with debit/credit card'
                                                                    : 'Pay via your bank portal'}
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: 999,
                                                            border: '2px solid',
                                                            borderColor: 'primary.main',
                                                            bgcolor:
                                                                paymentMethod === method.value
                                                                    ? 'primary.main'
                                                                    : 'transparent',
                                                        }}
                                                    />
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                )}

                                {activeStep === 1 && (
                                    <Box sx={{ display: 'grid', gap: 2 }}>
                                        {paymentMethod === 'UPI' && (
                                            <TextField
                                                label="UPI ID"
                                                name="upiId"
                                                value={formData.upiId}
                                                onChange={handleInputChange}
                                                placeholder="name@bank"
                                                fullWidth
                                                autoFocus
                                            />
                                        )}

                                        {paymentMethod === 'CARD' && (
                                            <>
                                                <TextField
                                                    label="Card Number"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    fullWidth
                                                    autoFocus
                                                />
                                                <TextField
                                                    label="Name on Card"
                                                    name="cardName"
                                                    value={formData.cardName}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                />
                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <TextField
                                                        label="Expiry"
                                                        name="expiry"
                                                        value={formData.expiry}
                                                        onChange={handleInputChange}
                                                        placeholder="MM/YY"
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        label="CVV"
                                                        name="cvv"
                                                        value={formData.cvv}
                                                        onChange={handleInputChange}
                                                        inputProps={{ maxLength: 4 }}
                                                        fullWidth
                                                    />
                                                </Box>
                                            </>
                                        )}

                                        {paymentMethod === 'NET_BANKING' && (
                                            <FormControl fullWidth>
                                                <FormLabel>Select Bank</FormLabel>
                                                <RadioGroup
                                                    value={formData.bank}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, bank: e.target.value })
                                                    }
                                                >
                                                    {['HDFC', 'ICICI', 'SBI', 'AXIS', 'KOTAK'].map((bank) => (
                                                        <FormControlLabel
                                                            key={bank}
                                                            value={bank}
                                                            control={<Radio />}
                                                            label={bank}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        )}
                                    </Box>
                                )}

                                {activeStep === 2 && (
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={900} gutterBottom>
                                            Confirm payment
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box sx={{ display: 'grid', gap: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Method: <strong>{paymentMethod}</strong>
                                            </Typography>
                                            {paymentMethod === 'UPI' && (
                                                <Typography variant="body2" color="text.secondary">
                                                    UPI ID: <strong>{formData.upiId || '-'}</strong>
                                                </Typography>
                                            )}
                                            {paymentMethod === 'CARD' && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Card:{' '}
                                                    <strong>
                                                        •••• {formData.cardNumber.replace(/\\s/g, '').slice(-4) || '-'}
                                                    </strong>
                                                </Typography>
                                            )}
                                            {paymentMethod === 'NET_BANKING' && (
                                                <Typography variant="body2" color="text.secondary">
                                                    Bank: <strong>{formData.bank || '-'}</strong>
                                                </Typography>
                                            )}
                                            <Typography variant="body2" color="text.secondary">
                                                Amount: <strong>₹{amount}</strong>
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>

                            {/* Navigation */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                                <Button
                                    onClick={handleBack}
                                    disabled={activeStep === 0 || loading}
                                    sx={{ flex: 1 }}
                                >
                                    Back
                                </Button>

                                {activeStep < 2 ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                    sx={{
                                            flex: 1,
                                            background:
                                                (theme) => theme.custom?.gradients?.primary,
                                        }}
                                    >
                                        Continue
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handlePayment}
                                        disabled={loading}
                                        sx={{
                                            flex: 1,
                                            background:
                                                (theme) => theme.custom?.gradients?.success,
                                        }}
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            `Pay ₹${amount}`
                                        )}
                                    </Button>
                                )}
                            </Box>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '40px 20px' }}
                        >
                            <CheckCircle
                                sx={{ fontSize: 100, color: '#43e97b', mb: 2 }}
                            />
                            <Typography variant="h5" fontWeight="bold">
                                Payment Successful!
                            </Typography>
                            <Typography color="text.secondary">
                                Your 1-on-1 session request has been sent to the instructor.
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
