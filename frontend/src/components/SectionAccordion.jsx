import React from "react";
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
  createSection,
  createSubsection,
  updateAssignedItem,
  deleteAssignedItem,
  deleteSection,
  deleteSubsection,
  setActiveSection,
  setActiveSub,
  fetchStructure,
} from "@/store/sectionsSlice";

const SectionAccordion = () => {
  const dispatch = useDispatch();

  const selectedCustomer = useSelector((s) => s.customers.selectedCustomer);
  const sections = useSelector((s) => s.sections.structure);
  const activeSection = useSelector((s) => s.sections.activeSection);
  const activeSub = useSelector((s) => s.sections.activeSub);

  const [newSection, setNewSection] = React.useState("");
  const [newSub, setNewSub] = React.useState("");
  const [editing, setEditing] = React.useState({});

  React.useEffect(() => {
    if (selectedCustomer?._id) {
      dispatch(fetchStructure(selectedCustomer._id));
    }
  }, [dispatch, selectedCustomer]);

  React.useEffect(() => {
    if (sections.length > 0 && activeSection === null) {
      dispatch(setActiveSection(0));
    }
  }, [sections, activeSection, dispatch]);

  const calcSubtotal = (sec) => {
    let total = 0;
    sec.items?.forEach((it) => (total += (it.quantity || 0) * (it.rate || 0)));
    sec.subsections?.forEach((sub) =>
      sub.items?.forEach((it) => (total += (it.quantity || 0) * (it.rate || 0)))
    );
    return total;
  };

  const handleAddSection = () => {
    if (!newSection.trim() || !selectedCustomer?._id) return;
    dispatch(
      createSection({ customerId: selectedCustomer._id, name: newSection })
    ).then(() => dispatch(fetchStructure(selectedCustomer._id)));
    setNewSection("");
  };

  const handleAddSub = (sectionIndex) => {
    if (!newSub.trim() || !selectedCustomer?._id) return;
    const sec = sections[sectionIndex];
    if (!sec) return;
    dispatch(
      createSubsection({
        customerId: selectedCustomer._id,
        sectionId: sec.sectionId,
        name: newSub,
      })
    ).then(() => dispatch(fetchStructure(selectedCustomer._id)));
    setNewSub("");
  };

  const handleSaveEdit = (assignedId, edit) => {
    dispatch(updateAssignedItem({ id: assignedId, data: edit })).then(() =>
      dispatch(fetchStructure(selectedCustomer._id))
    );
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden p-4 bg-primary-dark/20 rounded-lg border border-accent text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Project Sections</h2>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add Section..."
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddSection();
          }}
          className="flex-1 bg-primary-dark/40 border-accent"
        />
        <Button variant="outline" onClick={handleAddSection}>
          Add
        </Button>
      </div>

      {/* Scrollable Area */}
      <div
        className="flex-1 overflow-y-auto pr-2
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-thumb]:bg-accent/30
        [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <Accordion
          type="single"
          collapsible
          value={activeSection !== null ? `sec-${activeSection}` : ""}
          onValueChange={(v) =>
            dispatch(setActiveSection(v ? Number(v.split("-")[1]) : null))
          }
        >
          {sections.map((sec, sIndex) => {
            const subtotal = calcSubtotal(sec);
            const isOpen = activeSection === sIndex;

            return (
              <AccordionItem
                key={sec.sectionId || sIndex}
                value={`sec-${sIndex}`}
                className="mb-3 border border-accent/40 rounded-lg bg-black/20"
              >
                {/* ----- HEADER WITH DELETE BUTTON (NO OVERLAP) ----- */}
                <div className="flex items-center gap-3 pr-3">
                  {/* Trigger takes full width */}
                  <div className="flex-1">
                    <AccordionTrigger
                      className={`w-full py-3 px-3 flex justify-between items-center
                        ${
                          isOpen
                            ? "bg-primary-dark/40 border-l-4 border-accent pl-2 text-light-blue"
                            : ""
                        }`}
                    >
                      <span className="text-lg font-semibold truncate">
                        {sec.sectionName || sec.name}
                      </span>
                      <span className="text-sm font-mono opacity-90 shrink-0 ml-3">
                        ₹ {subtotal.toFixed(2)}
                      </span>
                    </AccordionTrigger>
                  </div>

                  {/* Delete section button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!window.confirm("Delete this entire section?")) return;
                      if (!selectedCustomer?._id) return;
                      dispatch(deleteSection(sec.sectionId)).then(() =>
                        dispatch(fetchStructure(selectedCustomer._id))
                      );
                    }}
                  >
                    Del
                  </Button>
                </div>

                {/* CONTENT */}
                <AccordionContent className="p-4">
                  {/* Add Subsection */}
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add Subsection..."
                      value={isOpen ? newSub : ""}
                      onChange={(e) => setNewSub(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSub(sIndex);
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleAddSub(sIndex)}
                    >
                      Add
                    </Button>
                  </div>

                  {/* Subsections */}
                  {sec.subsections?.map((sub, subIndex) => {
                    const subTotal = sub.items?.reduce(
                      (t, it) => t + (it.quantity || 0) * (it.rate || 0),
                      0
                    );

                    return (
                      <div
                        key={sub.subsectionId || subIndex}
                        className={`relative p-3 rounded-lg border mb-3 cursor-pointer
                          ${
                            activeSub === subIndex
                              ? "border-accent bg-accent/20"
                              : "border-accent/30 bg-primary-dark/10"
                          }`}
                        onClick={() => dispatch(setActiveSub(subIndex))}
                      >
                        <div className="flex justify-between items-center">
                          <strong className="text-lg">{sub.name}</strong>

                          <div className="flex gap-2 items-center">
                            <span className="text-sm font-mono">
                              ₹ {subTotal?.toFixed(2)}
                            </span>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!window.confirm("Delete this subsection?"))
                                  return;
                                if (!selectedCustomer?._id) return;
                                dispatch(
                                  deleteSubsection(sub.subsectionId)
                                ).then(() =>
                                  dispatch(
                                    fetchStructure(selectedCustomer._id)
                                  )
                                );
                              }}
                            >
                              Del
                            </Button>
                          </div>
                        </div>

                        {/* Items inside subsection */}
                        <div className="mt-3 space-y-2">
                          {sub.items?.map((it) => {
                            const qty = it.quantity || 0;
                            const rate = it.rate || 0;
                            const id = it.id || it._id;

                            return (
                              <div
                                key={id}
                                className="flex justify-between items-center p-2 border rounded border-accent/30"
                              >
                                <div>
                                  <div className="font-medium">{it.name}</div>
                                  <div className="text-sm font-mono">
                                    ₹ {(qty * rate).toFixed(2)}
                                  </div>
                                </div>

                                <div className="flex gap-2 items-center">
                                  <span className="text-xs">x{qty}</span>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      dispatch(
                                        deleteAssignedItem(id)
                                      ).then(() =>
                                        dispatch(
                                          fetchStructure(
                                            selectedCustomer._id
                                          )
                                        )
                                      )
                                    }
                                  >
                                    Del
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  <Separator className="my-4" />

                  {/* Global Items */}
                  <h3 className="text-lg font-bold">
                    Global Items in {sec.sectionName || sec.name}
                  </h3>

                  {sec.items?.map((it) => {
                    const qty = it.quantity || 0;
                    const rate = it.rate || 0;
                    const id = it.id || it._id;

                    return (
                      <div
                        key={id}
                        className="flex justify-between items-center p-2 mt-2 border rounded border-accent/30"
                      >
                        <div>
                          <div className="font-medium">{it.name}</div>
                          <div className="text-sm font-mono">
                            ₹ {(qty * rate).toFixed(2)}
                          </div>
                        </div>

                        <div className="flex gap-2 items-center">
                          <span className="text-xs">x{qty}</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              dispatch(deleteAssignedItem(id)).then(() =>
                                dispatch(fetchStructure(selectedCustomer._id))
                              )
                            }
                          >
                            Del
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default SectionAccordion;
