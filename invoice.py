import json
from datetime import datetime
from jinja2 import Template
from weasyprint import HTML

# 1. INPUT DATA
json_data = """
{
  "billId": "69224c7dd2e8e0bb4e9f1234",
  "billNumber": "BILL-1732301234567",
  "billDate": "2025-11-23T12:25:12.452Z",
  "notes": "Installation work for kitchen and hall",
  "totalAmount": 1750,

  "customer": {
    "name": "John Doe",
    "phone": "9876543210",
    "address": "Flat 101, Oak Towers, Mumbai, MH",
    "gstNumber": "27ABCDE1234F1Z5"
  },

  "items": [
    {
      "name": "One Way Light Point",
      "unit": "Nos",
      "section": "Kitchen",
      "subsection": "Ceiling",
      "quantity": 3,
      "rate": 150,
      "amount": 450,
      "description": "Lights above the platform"
    },
    {
      "name": "Fan Installation",
      "unit": "Nos",
      "section": "Hall",
      "subsection": null,
      "quantity": 2,
      "rate": 250,
      "amount": 500,
      "description": "2 fans near balcony"
    },
    {
      "name": "Tube fitting",
      "unit": "Nos",
      "section": "Bedroom",
      "subsection": "Wall",
      "quantity": 4,
      "rate": 200,
      "amount": 800,
      "description": "4 wall tube lights"
    }
  ],
  
  "company": {
      "name": "Dattatray Potdar",
      "address": "Sunshine Nagar,Rahatani, Pune, MAHARASHTRA, 411018",
      "email": "dpp1980@gmail.com",
      "bank": "HDFC BANK",
      "account_no": "00071140048455",
      "ifsc": " HDFC0000007",
      "branch": "BHANDARKAR ROAD"
  }
}
"""

# 2. DATA PROCESSING
data = json.loads(json_data)
dt_obj = datetime.fromisoformat(data['billDate'].replace('Z', '+00:00'))
data['formatted_date'] = dt_obj.strftime("%d %b %Y")
data['amount_in_words'] = "One Thousand Seven Hundred Fifty Only" # Mock logic

# 3. HTML/CSS TEMPLATE (Strict Grid Layout)
html_template = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { size: A4; margin: 10mm; }

        /* Poppins font (Google style) */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        body {
            font-family: 'Poppins', sans-serif;
            font-size: 11px;
            color: #111827;
            background: #f3f4f6;
            line-height: 1.4;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td, th {
            vertical-align: top;
        }

        .invoice-wrapper {
            background: #ffffff;
            border-radius: 10px;
            padding: 0;
            border: 1px solid #e5e7eb;
        }

        .header-main {
            background: #1a73e8;
            color: #ffffff;
            padding: 14px 20px;
            font-size: 20px;
            font-weight: 600;
        }

        .header-sub {
            background: #1a73e8;
            color: #ffffff;
            padding: 6px 20px 10px 20px;
            font-size: 12px;
            font-weight: 500;
        }

        .card {
            background: #f9fafb;
            border-radius: 8px;
            padding: 10px 14px;
            border: 1px solid #e5e7eb;
        }

        .card-label {
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 2px;
        }

        .card-value {
            font-size: 11px;
            font-weight: 500;
        }

        .section-title {
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .muted {
            color: #6b7280;
            font-size: 10px;
        }

        .items-table {
            margin-top: 12px;
            border-radius: 8px 8px 0 0;
            overflow: hidden;
        }

        .items-table th, .items-table td {
            border: 1px solid #e5e7eb;
            padding: 6px 8px;
        }

        .items-header {
            background: #1a73e8;
            color: #ffffff;
            font-size: 10px;
            font-weight: 500;
        }

        .items-header th {
            text-align: left;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .bold { font-weight: 600; }

        .item-name {
            font-size: 11px;
            font-weight: 500;
        }

        .item-desc {
            font-size: 10px;
            color: #6b7280;
        }

        .totals-wrapper {
            margin-top: 12px;
        }

        .totals-wrapper td {
            padding: 4px 8px;
        }

        .totals-label {
            font-size: 10px;
            color: #4b5563;
        }

        .totals-value {
            font-size: 10px;
            text-align: right;
        }

        .total-row {
            background: #1a73e8;
            color: #ffffff;
            border-radius: 20px;
            padding: 6px 10px;
            font-size: 11px;
            font-weight: 600;
        }

        .total-label {
            text-align: left;
        }

        .total-amount {
            text-align: right;
        }

        .amount-words {
            font-size: 10px;
            margin-top: 8px;
        }

        .signature-block {
            margin-top: 20px;
            text-align: right;
            font-size: 10px;
        }

        .signature-line {
            margin-top: 24px;
            border-top: 1px solid #d1d5db;
            width: 160px;
            margin-left: auto;
            padding-top: 4px;
        }

        .footer {
            margin-top: 6px;
            text-align: center;
            font-size: 9px;
            color: #ff6a00; /* BillMaster orange */
            font-weight: 600;
        }
    </style>
</head>
<body>

<table>
    <tr>
        <td>
            <!-- Blue header -->
            <div class="header-main">
                {{ company.name }}
            </div>
            <div class="header-sub">
                TAX INVOICE
            </div>
        </td>
    </tr>

    <tr>
        <td style="padding: 10px 16px 12px 16px;">
            <table class="invoice-wrapper">
                <tr>
                    <td style="padding: 16px 18px;">
                        <!-- Top company & GST block -->
                        <table>
                            <tr>
                                <td style="width: 60%; padding-right: 10px;">
                                    <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px;">
                                        {{ company.name }}
                                    </div>
                                    <div class="muted">
                                        {{ company.address }}
                                    </div>
                                </td>
                                <td style="width: 40%;">
                                    <div class="muted">
                                        GSTIN: {{ company.gst }}<br>
                                        Email: {{ company.email }}
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Invoice info cards -->
                        <table style="margin-top: 12px;">
                            <tr>
                                <td style="width: 33%; padding-right: 6px;">
                                    <div class="card">
                                        <div class="card-label">Invoice #</div>
                                        <div class="card-value">{{ billNumber }}</div>
                                    </div>
                                </td>
                                <td style="width: 33%; padding: 0 3px;">
                                    <div class="card">
                                        <div class="card-label">Invoice Date</div>
                                        <div class="card-value">{{ formatted_date }}</div>
                                    </div>
                                </td>
                                <td style="width: 33%; padding-left: 6px;">
                                    <div class="card">
                                        <div class="card-label">Due Date</div>
                                        <div class="card-value">{{ formatted_date }}</div>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Customer / Billing blocks -->
                        <table style="margin-top: 12px;">
                            <tr>
                                <td style="width: 50%; padding-right: 6px;">
                                    <div class="card">
                                        <div class="section-title">Customer Details</div>
                                        <div class="bold" style="font-size: 11px;">{{ customer.name }}</div>
                                        <div class="muted">
                                            {{ customer.address }}<br>
                                            Ph: {{ customer.phone }}
                                        </div>
                                    </div>
                                </td>
                                <td style="width: 50%; padding-left: 6px;">
                                    <div class="card">
                                        <div class="section-title">Billing Address</div>
                                        <div class="muted">
                                            {{ customer.address }}<br>
                                            Place of Supply: 27 - MAHARASHTRA
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Items table -->
                        <table class="items-table" style="margin-top: 14px;">
                            <thead>
                                <tr class="items-header">
                                    <th style="width: 5%; text-align:center;">#</th>
                                    <th style="width: 50%;">Item</th>
                                    <th style="width: 10%; text-align:center;">Qty</th>
                                    <th style="width: 15%; text-align:right;">Rate / Item</th>
                                    <th style="width: 20%; text-align:right;">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {% for item in items %}
                                <tr>
                                    <td class="text-center">{{ loop.index }}</td>
                                    <td>
                                        <div class="item-name">{{ item.name }}</div>
                                        <div class="item-desc">
                                            {{ item.description }}
                                        </div>
                                    </td>
                                    <td class="text-center">{{ item.quantity }} {{ item.unit }}</td>
                                    <td class="text-right">{{ "{:,.2f}".format(item.rate) }}</td>
                                    <td class="text-right bold">{{ "{:,.2f}".format(item.amount) }}</td>
                                </tr>
                                {% endfor %}
                            </tbody>
                        </table>

                        <!-- Bank & totals -->
                        <table class="totals-wrapper">
                            <tr>
                                <td style="width: 55%; padding-top: 10px; padding-right: 10px;">
                                    <div style="font-size: 10px; font-weight: 600; margin-bottom: 4px;">
                                        Bank Details:
                                    </div>
                                    <div class="muted">
                                        Bank: {{ company.bank }}<br>
                                        Account #: {{ company.account_no }}<br>
                                        IFSC Code: {{ company.ifsc }}<br>
                                        Branch: {{ company.branch }}
                                    </div>

                                    <div class="amount-words">
                                        <span class="muted">Total amount (in words):</span><br>
                                        INR {{ amount_in_words }}
                                    </div>
                                </td>

                                <td style="width: 45%; padding-top: 10px;">
                                    <table style="width: 100%;">
                                        <tr>
                                            <td class="totals-label">Delivery / Shipping Charges</td>
                                            <td class="totals-value">&#8377; 0.00</td>
                                        </tr>
                                        <tr>
                                            <td class="totals-label">Taxable Amount</td>
                                            <td class="totals-value">{{ "{:,.2f}".format(totalAmount) }}</td>
                                        </tr>
                                        <tr>
                                            <td class="totals-label">CGST 9.0%</td>
                                            <td class="totals-value">&#8377; 0.00</td>
                                        </tr>
                                        <tr>
                                            <td class="totals-label">SGST 9.0%</td>
                                            <td class="totals-value">&#8377; 0.00</td>
                                        </tr>
                                    </table>

                                    <table style="width: 100%; margin-top: 6px;">
                                        <tr>
                                            <td colspan="2">
                                                <div class="total-row">
                                                    <table style="width:100%; border-collapse:collapse;">
                                                        <tr>
                                                            <td class="total-label">Total</td>
                                                            <td class="total-amount">
                                                                &#8377; {{ "{:,.2f}".format(totalAmount) }}
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>

                                    <table style="width: 100%; margin-top: 6px;">
                                        <tr>
                                            <td class="totals-label">Total Discount</td>
                                            <td class="totals-value">&#8377; 0.00</td>
                                        </tr>
                                        <tr>
                                            <td class="totals-label">Amount Payable</td>
                                            <td class="totals-value">
                                                &#8377; {{ "{:,.2f}".format(totalAmount) }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="totals-label">Amount Paid</td>
                                            <td class="totals-value">&#8377; 0.00</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <!-- Signature -->
                        <div class="signature-block">
                            For {{ company.name }}
                            <div class="signature-line">
                                Authorized Signatory
                            </div>
                        </div>

                    </td>
                </tr>
            </table>

            <div class="footer">
                Made with BillMaster
            </div>
        </td>
    </tr>
</table>

</body>
</html>
"""


# 4. RENDER
template = Template(html_template)
rendered_html = template.render(**data)

HTML(string=rendered_html).write_pdf("tata_grid_fixed.pdf")
print("PDF Generated: tata_grid_fixed.pdf")