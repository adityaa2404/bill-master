import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSelector, useDispatch } from "react-redux";

import {
  addSection,
  addSubsection,
  setActiveSection,
  setActiveSub,
  editItem,
  deleteItem,
  selectSectionSubtotal,
} from "@/store/billingSlice";

export default function SectionAccordion() {
  const dispatch = useDispatch();
  const sections = useSelector((s) => s.billing.sections);
  const activeSection = useSelector((s) => s.billing.activeSection);
  const activeSub = useSelector((s) => s.billing.activeSub);

  const subtotalSelector = useSelector((state) => (index) =>
    selectSectionSubtotal(state, index)
  );

  const [newSection, setNewSection] = useState("");
  const [newSub, setNewSub] = useState("");
  const [editing, setEditing] = useState({});

  const handleAddSection = () => {
    if (!newSection.trim()) return;
    dispatch(addSection(newSection.trim()));
    setNewSection("");
  };

  const handleAddSubsection = (sIndex) => {
    if (!newSub.trim()) return;
    dispatch(addSubsection(newSub.trim()));
    setNewSub("");
    dispatch(setActiveSection(sIndex));
  };

  const startEdit = (sIdx, subIdx, item) => {
    const key = `${sIdx}-${subIdx ?? "g"}-${item.id}`;
    setEditing((p) => ({
      ...p,
      [key]: { qty: item.qty, rate: item.rate },
    }));
  };

  const saveEdit = (sIdx, subIdx, itemId) => {
    const key = `${sIdx}-${subIdx ?? "g"}-${itemId}`;
    if (!editing[key]) return;

    dispatch(
      editItem({
        sectionIdx: sIdx,
        subIdx,
        itemId,
        qty: Number(editing[key].qty),
        rate: Number(editing[key].rate),
      })
    );

    const copy = { ...editing };
    delete copy[key];
    setEditing(copy);
  };

  return (
    // MAIN CONTAINER: flex-col + h-full + overflow-hidden ensures border contains everything
    <div className="flex flex-col w-full h-full min-h-0 p-4 bg-primary-dark/20 border border-accent rounded-lg text-white overflow-hidden">
      
      {/* HEADER: Fixed height (shrink-0) */}
      <div className="shrink-0 mb-4">
        <h2 className="text-2xl font-bold mb-4">Project Sections</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Add Section (e.g., Master Bedroom)"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
            className="bg-primary-dark/40 border-accent flex-1"
          />
          <Button variant="outline" onClick={handleAddSection}>
            Add
          </Button>
        </div>
      </div>

      {/* LIST CONTAINER: flex-1 (grows to fill space) + overflow-y-auto (scrolls internally) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-accent/20
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-accent/40">
        
        <Accordion 
          type="single" 
          collapsible 
          className="w-full pb-2"
          value={activeSection !== null ? `sec-${activeSection}` : ""}
          onValueChange={(value) => {
            if (value) {
              const index = parseInt(value.split("-")[1]);
              dispatch(setActiveSection(index));
            } else {
              dispatch(setActiveSection(null));
            }
          }}
        >
          {sections.map((section, sIndex) => {
            const sectionSubtotal = subtotalSelector(sIndex);
            const isSelected = activeSection === sIndex;

            return (
              <AccordionItem key={sIndex} value={`sec-${sIndex}`} className="border-b-0 mb-2">
                <AccordionTrigger
                  // FIXED: items-center aligns text and price perfectly vertically
                  className={`py-3 px-3 flex justify-between w-full rounded-md transition hover:bg-white/5 items-center
                    ${
                      isSelected
                        ? "bg-primary-dark/30 text-light-blue font-semibold border-l-4 border-accent pl-2"
                        : "text-white"
                    }
                  `}
                >
                  <span className={`text-xl text-left ${isSelected ? "text-light-blue" : ""}`}>
                    {section.name}
                  </span>
                  <span className="text-lg font-mono opacity-90 shrink-0 ml-2">₹ {sectionSubtotal.toFixed(2)}</span>
                </AccordionTrigger>

                <AccordionContent className="p-3 bg-black/20 rounded-b-md">
                  
                  {/* Subsection Input */}
                  <div className="flex gap-2 my-2 w-full">
                    <Input
                      placeholder="Add Subsection"
                      value={isSelected ? newSub : ""}
                      onChange={(e) => setNewSub(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSubsection(sIndex)}
                      className="flex-1" // Ensure input takes space but respects button
                    />
                    <Button variant="outline" onClick={() => handleAddSubsection(sIndex)}>
                      Add
                    </Button>
                  </div>

                  {/* Subsections List */}
                  <div className="space-y-3 mt-3">
                    {section.subsections.map((sub, subIndex) => (
                      <div
                        key={subIndex}
                        className={`border border-accent/30 rounded-lg p-3 cursor-pointer transition
                          ${
                            isSelected && activeSub === subIndex
                              ? "bg-accent/20 border-accent"
                              : "bg-primary-dark/10"
                          }
                        `}
                        onClick={() => dispatch(setActiveSub(subIndex))}
                      >
                        <div className="flex justify-between items-center">
                          <strong className="text-lg">{sub.name}</strong>
                          <span className="text-sm text-muted-foreground font-mono">
                            ₹ {sub.items.reduce((sum, it) => sum + it.qty * it.rate, 0).toFixed(2)}
                          </span>
                        </div>

                        {/* Items in Subsection */}
                        <div className="mt-3 space-y-2">
                          {sub.items.map((it) => {
                            const key = `${sIndex}-${subIndex}-${it.id}`;
                            const isEditing = editing[key];
                            return (
                              <div key={it.id} className="flex justify-between items-center border border-accent/20 p-2 rounded gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{it.name}</div>
                                  <div className="text-sm text-muted-foreground font-mono">₹ {(it.qty * it.rate).toFixed(2)}</div>
                                </div>
                                {isEditing ? (
                                   <div className="flex items-center gap-2 shrink-0">
                                      <Input type="number" className="w-16 h-8" value={isEditing.qty} onChange={(e) => setEditing({...editing, [key]: {...isEditing, qty: e.target.value}})} />
                                      <Input type="number" className="w-20 h-8" value={isEditing.rate} onChange={(e) => setEditing({...editing, [key]: {...isEditing, rate: e.target.value}})} />
                                      <Button size="sm" variant="outline" className="h-8" onClick={() => saveEdit(sIndex, subIndex, it.id)}>Save</Button>
                                   </div>
                                ) : (
                                   <div className="flex items-center gap-2 shrink-0">
                                     <div className="text-xs text-muted-foreground">x{it.qty}</div>
                                     <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => startEdit(sIndex, subIndex, it)}>Edit</Button>
                                     <Button size="sm" variant="destructive" className="h-8 px-2" onClick={() => dispatch(deleteItem({ sectionIdx: sIndex, subIdx: subIndex, itemId: it.id }))}>Del</Button>
                                   </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Global Items */}
                    <div className="mt-4">
                      <strong className="text-lg">Global Items in {section.name}</strong>
                      {(section.items ?? []).map((it) => {
                         const key = `${sIndex}-g-${it.id}`;
                         const isEditing = editing[key];
                         return (
                           <div key={it.id} className="flex justify-between items-center border border-accent/20 p-2 rounded mt-2 gap-2">
                              <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{it.name}</div>
                                  <div className="text-sm text-muted-foreground font-mono">₹ {(it.qty * it.rate).toFixed(2)}</div>
                              </div>
                              {isEditing ? (
                                   <div className="flex items-center gap-2 shrink-0">
                                      <Input type="number" className="w-16 h-8" value={isEditing.qty} onChange={(e) => setEditing({...editing, [key]: {...isEditing, qty: e.target.value}})} />
                                      <Input type="number" className="w-20 h-8" value={isEditing.rate} onChange={(e) => setEditing({...editing, [key]: {...isEditing, rate: e.target.value}})} />
                                      <Button size="sm" variant="outline" className="h-8" onClick={() => saveEdit(sIndex, null, it.id)}>Save</Button>
                                   </div>
                                ) : (
                                   <div className="flex items-center gap-2 shrink-0">
                                     <div className="text-xs text-muted-foreground">x{it.qty}</div>
                                     <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => startEdit(sIndex, null, it)}>Edit</Button>
                                     <Button size="sm" variant="destructive" className="h-8 px-2" onClick={() => dispatch(deleteItem({ sectionIdx: sIndex, itemId: it.id }))}>Del</Button>
                                   </div>
                                )}
                           </div>
                         )
                      })}
                    </div>
                  </div>

                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-500">Section Subtotal</span>
                    <span className="text-xl font-bold text-green-200 font-mono">₹ {sectionSubtotal.toFixed(2)}</span>
                  </div>

                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}