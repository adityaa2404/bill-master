import json
from datetime import datetime
from jinja2 import Template
from weasyprint import HTML
import re
# 1. INPUT DATA (Your new JSON format)
json_input = """
{"customer":{"_id":"692801673c5d74bac6836697","name":"Test4","phone":"1234567890","address":"Pune","createdAt":"2025-11-27T07:44:39.367Z","__v":0},"items":[{"id":"692801bb3c5d74bac68366bb","itemId":"6921da6c0475267a26190f4f","name":"6 Amp Socket Point","unit":"Nos","quantity":2,"rate":500,"amount":1000,"sectionId":"692801a03c5d74bac68366b0","subsectionId":"692801a73c5d74bac68366b5"},{"id":"692801ee3c5d74bac68366c9","itemId":"6921da6c0475267a26190f57","name":"LED Panel Light / COB lights / cylinder light fitting","unit":"Nos","quantity":1,"rate":220,"amount":220,"sectionId":"692801923c5d74bac68366ab","subsectionId":"692801c93c5d74bac68366c2"}]}
"""
# 2. DATA PROCESSING
raw_data = json.loads(json_input)

# Prepare the context dictionary for the template
context = {}

# A. Company Details (Still hardcoded as they aren't in the input JSON)
context['company'] = {
    "name": "Dattatray Potdar",
    "address": "Sunshine Nagar, Rahatani, Pune, MAHARASHTRA, 411018",
    "email": "dpp1980@gmail.com",
    "bank": "HDFC BANK",
    "account_no": "00071140048455",
    "ifsc": "HDFC0000007",
    "branch": "BHANDARKAR ROAD",
    "gst": "27AAAAA0000A1Z5"
}

# B. Customer Details (Extracted from Input)
# Mapping fields from input to what template expects
customer_data = raw_data.get('customer', {})
context['customer'] = {
    "name": customer_data.get('name', 'N/A'),
    "phone": customer_data.get('phone', ''),
    "address": customer_data.get('address', ''),
    "gstNumber": customer_data.get('gstNumber', '') # Handle if missing
}

# C. Invoice Metadata (Generated Dynamically)
current_time = datetime.now()
context['billNumber'] = f"INV-{int(current_time.timestamp())}"
context['formatted_date'] = current_time.strftime("%d %b %Y")

# D. Item Aggregation Logic
# Logic: Merge items if they have the same 'itemId' AND 'rate'
merged_items_map = {}
raw_items = raw_data.get('items', [])

for item in raw_items:
    # Key = (itemId, rate)
    key = (item['itemId'], item['rate'])
    
    if key in merged_items_map:
        # Existing item found, update totals
        merged_items_map[key]['quantity'] += item['quantity']
        merged_items_map[key]['amount'] += item['amount']
    else:
        # New item, clean up data
        clean_item = {
            'name': item['name'],
            'unit': item['unit'],
            'rate': item['rate'],
            'quantity': item['quantity'],
            'amount': item['amount'],
            'description': "" # Input JSON doesn't have desc, setting empty
        }
        merged_items_map[key] = clean_item

# Convert dictionary values back to list
context['items'] = list(merged_items_map.values())

# E. Totals
total_amount = sum(item['amount'] for item in context['items'])
context['totalAmount'] = total_amount
context['amount_in_words'] = f"Rupees {total_amount:,.2f} Only" # Placeholder logic

# 3. HTML TEMPLATE
html_template = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">

    <style>
        @page { size: A4; margin: 12mm; }
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        body {
            font-family: 'Poppins', sans-serif;
            font-size: 11px;
            color: #111827;
            background: #ffffff;
            line-height: 1.45;
        }

        .header-box {
            background: #1a73e8;
            padding: 18px 20px;
            color: white;
            border-radius: 8px;
        }

        .header-title {
            font-size: 22px;
            font-weight: 700;
        }

        .sub-title {
            font-size: 13px;
            margin-top: 2px;
            opacity: 0.9;
        }

        /* Top Summary Cards */
        .top-card {
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            border-radius: 6px;
            padding: 8px 12px;
        }

        .label {
            font-size: 10px;
            color: #6b7280;
        }

        .value {
            font-size: 12px;
            font-weight: 600;
        }

        /* Items Table */
        .items-table {
            margin-top: 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            width: 100%;
        }

        .items-table th {
            background: #1a73e8;
            color: white;
            padding: 8px 6px;
            font-size: 10.5px;
        }

        .items-table td {
            padding: 8px 6px;
            border-bottom: 1px solid #e5e7eb;
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: 600; }

        /* Total Box */
        .total-box {
            background: #1a73e8;
            color: #fff;
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
        }

        .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 9px;
            color: #374151;
            padding-top: 10px;
            border-top: 1px dashed #cbd5e1;
        }

        .bank-box {
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            border-radius: 6px;
            padding: 10px 12px;
        }

    </style>
</head>

<body>

<!-- Header -->
<div class="header-box">
    <div class="header-title">{{ company.name }}</div>
    <div class="sub-title">INVOICE</div>
</div>

<div style="padding: 20px;">

    <!-- Top Block (Company + Invoice Info + Customer) -->
    <table width="100%" cellspacing="0" cellpadding="0">
        <tr>

            <!-- Company Details -->
            <td style="width: 33%; vertical-align: top;">

                <div class="value" style="font-size: 13px;">
                    {{ company.name }}
                </div>

                <div class="label" style="margin-top: 2px;">
                    {{ company.address }}
                </div>

                <div class="label">GSTIN: {{ company.gst }}</div>
                <div class="label">Email: {{ company.email }}</div>

            </td>

            <!-- Invoice Details -->
            <td style="width: 33%; vertical-align: top; padding-left: 20px;">

                <div class="top-card">
                    <div class="label">Invoice Number</div>
                    <div class="value">{{ billNumber }}</div>

                    <div class="label" style="margin-top: 6px;">Date</div>
                    <div class="value">{{ formatted_date }}</div>
                </div>

            </td>

            <!-- Customer Details (FIXED ALIGNMENT) -->
            <td style="width: 33%; vertical-align: top; padding-left: 20px;">

                <div class="top-card">
                    <div class="label">Customer</div>
                    <div class="value">{{ customer.name }}</div>

                    {% if customer.phone %}
                    <div class="label" style="margin-top: 4px;">
                        {{ customer.phone }}
                    </div>
                    {% endif %}

                    {% if customer.address %}
                    <div class="label" style="margin-top: 4px;">
                        Address: {{ customer.address }}
                    </div>
                    {% endif %}
                </div>

            </td>

        </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table" cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th class="text-center" style="width: 5%;">#</th>
                <th>Description</th>
                <th class="text-center" style="width: 12%;">Qty</th>
                <th class="text-right" style="width: 12%;">Rate</th>
                <th class="text-right" style="width: 15%;">Amount</th>
            </tr>
        </thead>

        <tbody>
            {% for item in items %}
            <tr>
                <td class="text-center">{{ loop.index }}</td>

                <td>
                    <span class="bold">{{ item.name }}</span>
                </td>

                <td class="text-center">
                    {{ item.quantity }} {{ item.unit }}
                </td>

                <td class="text-right">
                    {{ "{:,.2f}".format(item.rate) }}
                </td>

                <td class="text-right bold">
                    {{ "{:,.2f}".format(item.amount) }}
                </td>
            </tr>
            {% endfor %}
        </tbody>
    </table>

    <!-- Totals + Bank Section -->
    <table width="100%" style="margin-top: 18px;">
        <tr>

            <td style="width: 60%; vertical-align: top;">

                <div class="bank-box">
                    <div class="label">Bank Details</div>

                    <div class="value" style="font-weight: 600;">
                        {{ company.bank }}
                    </div>

                    <div class="label" style="margin-top: 2px;">
                        A/C: {{ company.account_no }} | IFSC: {{ company.ifsc }}
                    </div>

                    <div class="label" style="margin-top: 10px;">Amount in Words:</div>
                    <div class="value" style="margin-top: 2px;">
                        <i>{{ amount_in_words }}</i>
                    </div>

                </div>

            </td>

            <td style="width: 40%; vertical-align: top; padding-left: 18px;">

                <table width="100%">
                    <tr>
                        <td class="label">Sub Total</td>
                        <td class="text-right value">{{ "{:,.2f}".format(totalAmount) }}</td>
                    </tr>

                    <tr>
                        <td class="label">Tax (0%)</td>
                        <td class="text-right label">0.00</td>
                    </tr>

                    <tr><td colspan="2" style="height: 10px;"></td></tr>

                    <tr>
                        <td colspan="2">
                            <div class="total-box">
                                <table width="100%">
                                    <tr>
                                        <td>Total Payable</td>
                                        <td class="text-right">₹ {{ "{:,.2f}".format(totalAmount) }}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                </table>

            </td>

        </tr>
    </table>

    <!-- Signature -->
    <div style="margin-top: 35px; text-align: right;">
        <div class="label">For {{ company.name }}</div>

        <div style="margin-top: 35px; width: 160px; border-top: 1px solid #cccccc; margin-left: auto;"></div>
        <div class="label" style="margin-top: 4px;">Authorized Signatory</div>
    </div>

</div>

<div class="footer">
    Invoice generated by <b>BillMaster</b> — Smart Billing Automation
</div>

</body>
</html>


"""

# 4. RENDER
template = Template(html_template)
rendered_html = template.render(**context)
customer_name = re.sub(r"[^A-Za-z0-9]", "_", context["customer"]["name"])
filename = f"invoice_{customer_name}.pdf"
HTML(string=rendered_html).write_pdf(filename)
print(f"PDF Generated: bill_dynamic_customer.pdf | Customer: {context['customer']['name']} | Total: {context['totalAmount']}")