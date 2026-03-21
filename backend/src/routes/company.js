const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

// Fields that Prisma accepts for Company update
const ALLOWED = [
  'name','owner','phone','email','address','website','license','ein','logo',
  'defaultTaxRate','paymentTerms','laborBurdenDefault','invoiceFooter','estimateFooter',
  'smtpHost','smtpPort','smtpUser','smtpPass','smtpSecure',
  'emailFromName','emailReplyTo','emailSignature',
  'emailSubjectEstimate','emailSubjectInvoice','emailBodyEstimate','emailBodyInvoice',
  'notifyEstimateSent','notifyEstimateApproved','notifyEstimateDeclined',
  'notifyInvoiceSent','notifyInvoicePaid','notifyInvoiceOverdue','notifyPaymentReminder',
  'reminderDaysBefore','overdueFollowupDays',
  'themeAccent','themeName'
];

function pickAllowed(body) {
  var clean = {};
  ALLOWED.forEach(function(key) {
    if (body[key] !== undefined) clean[key] = body[key];
  });
  return clean;
}

// GET /api/company — returns the company for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    var company = await prisma.company.findUnique({ where: { id: req.companyId } });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/company/:id — update company settings
router.put('/:id', authenticate, async (req, res) => {
  try {
    var data = pickAllowed(req.body);
    var company = await prisma.company.update({
      where: { id: Number(req.params.id) },
      data: data
    });
    res.json(company);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
