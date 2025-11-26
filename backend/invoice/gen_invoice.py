import json
import sys
import os
from datetime import datetime
from jinja2 import Template
from weasyprint import HTML

# INPUT PATHS
input_json_path = sys.argv[1]
output_pdf_path = sys.argv[2]

# READ JSON
with open(input_json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# DATE
if data.get("invoiceDate"):
    try:
        dt = datetime.fromisoformat(data["invoiceDate"].replace("Z", "+00:00"))
        data["formatted_date"] = dt.strftime("%d %b %Y")
    except:
        data["formatted_date"] = ""
else:
    data["formatted_date"] = ""

# AMOUNT (words — simple)
data["amount_in_words"] = f"Rupees {data.get('totalAmount', 0):,.2f} Only"

# TEMPLATE PATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(BASE_DIR, "template.html")

with open(template_path, "r", encoding="utf-8") as f:
    html_template = f.read()

# RENDER
template = Template(html_template)
final_html = template.render(**data)

# GENERATE PDF
HTML(string=final_html).write_pdf(output_pdf_path)

print("PDF DONE:", output_pdf_path)
