import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SectionManager({ onAddItem }) {
  const [sections, setSections] = useState([]);

  const [sectionName, setSectionName] = useState("");
  const [subName, setSubName] = useState("");

  const [activeSection, setActiveSection] = useState(null);
  const [activeSub, setActiveSub] = useState(null);

  // ----- SAFE REF BINDING -----
  useEffect(() => {
    if (onAddItem && "current" in onAddItem) {
      onAddItem.current = addItemToSub;
    }
  }, [activeSection, activeSub, sections]);

  // Add Section
  const addSection = () => {
    if (!sectionName.trim()) return;
    setSections((prev) => [...prev, { name: sectionName, subsections: [] }]);
    setSectionName("");
  };

  // Add Subsection
  const addSubsection = () => {
    if (!subName.trim() || activeSection === null) return;

    setSections((prev) => {
      const updated = [...prev];
      updated[activeSection].subsections.push({
        name: subName,
        items: []
      });
      return updated;
    });

    setSubName("");
  };

  // Add item into selected subsection
  const addItemToSub = (itemName) => {
    if (activeSection === null || activeSub === null) {
      alert("Select a section and subsection first!");
      return;
    }

    setSections((prev) => {
      const updated = [...prev];
      updated[activeSection].subsections[activeSub].items.push(itemName);
      return updated;
    });
  };

  return (
    <div className="p-4 bg-primary-dark/20 border border-accent rounded-lg text-white">

      <h2 className="text-xl font-bold mb-4">Project Structure</h2>

      {/* Add Section */}
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Add Section (e.g., Kitchen)"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="bg-primary-dark/40 border-accent"
        />
        <Button variant="outline" onClick={addSection}>Add</Button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="border border-accent rounded-md p-3">

            {/* Section Header */}
            <h3
              onClick={() => {
                setActiveSection(sIdx);
                setActiveSub(null);
              }}
              className={`font-semibold cursor-pointer transition 
                ${activeSection === sIdx ? "text-accent" : "text-white"}`}
            >
              {sec.name}
            </h3>

            {/* Add Subsection */}
            {activeSection === sIdx && (
              <div className="flex gap-2 my-3">
                <Input
                  placeholder="Add Subsection (e.g., TV Unit)"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="bg-primary-dark/40 border-accent"
                />
                <Button variant="outline" onClick={addSubsection}>Add</Button>
              </div>
            )}

            {/* Subsections */}
            {sec.subsections.map((sub, subIdx) => (
              <div
                key={subIdx}
                onClick={() => setActiveSub(subIdx)}
                className={`ml-4 p-3 rounded-md cursor-pointer transition 
                  ${activeSub === subIdx && activeSection === sIdx
                    ? "bg-accent/20 border border-accent"
                    : "bg-primary-dark/10"}`}
              >
                <strong>{sub.name}</strong>

                {/* Items */}
                <ul className="ml-4 list-disc text-sm mt-1">
                  {sub.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        ))}
      </div>
    </div>
  );
}
