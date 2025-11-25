import json
from datetime import datetime
from jinja2 import Template
from weasyprint import HTML
import sys

def generate_pdf(data, output_path="invoice.pdf"):
    # Parse date
    dt_obj = datetime.fromisoformat(data['billDate'].replace('Z', '+00:00'))
    data['formatted_date'] = dt_obj.strftime("%d %b %Y")

    # Convert sections → items (flatten)
    flat_items = []
    for sec in data["sections"]:
        section_name = sec["sectionName"]
        
        # Global items
        for it in sec["items"]:
            flat_items.append({
                "name": it["name"],
                "unit": it.get("unit", ""),
                "quantity": it["quantity"],
                "rate": it["rate"],
                "amount": it["quantity"] * it["rate"],
                "section": section_name,
                "subsection": None,
                "description": it.get("notes", "")
            })

        # Subsection items
        for sub in sec["subsections"]:
            for it in sub["items"]:
                flat_items.append({
                    "name": it["name"],
                    "unit": it.get("unit", ""),
                    "quantity": it["quantity"],
                    "rate": it["rate"],
                    "amount": it["quantity"] * it["rate"],
                    "section": section_name,
                    "subsection": sub["name"],
                    "description": it.get("notes", "")
                })

    data["items"] = flat_items

    # Load HTML template
    template = Template(open("template.html", "r").read())

    html = template.render(**data)

    HTML(string=html).write_pdf(output_path)

    return output_path


if __name__ == "__main__":
    json_input = sys.argv[1]
    output = sys.argv[2]

    data = json.loads(open(json_input).read())
    generate_pdf(data, output)
