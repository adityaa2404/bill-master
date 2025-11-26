import json
import sys
import os
from datetime import datetime
from jinja2 import Template
from weasyprint import HTML

input_json_path = sys.argv[1]
output_pdf_path = sys.argv[2]

with open(input_json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

bill_date = data.get("invoiceDate") or datetime.now().isoformat()
dt = datetime.fromisoformat(bill_date.replace("Z", "+00:00"))
data["formatted_date"] = dt.strftime("%d %b %Y")
data["amount_in_words"] = f"{data.get('totalAmount')} Rupees Only"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(BASE_DIR, "template.html")

with open(template_path, "r", encoding="utf-8") as f:
    html_template = f.read()

template = Template(html_template)
html = template.render(**data)

HTML(string=html).write_pdf(output_pdf_path)
print("PDF SUCCESS")
