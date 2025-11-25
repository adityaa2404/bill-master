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
  setActiveSection,
  setActiveSub,
  fetchStructure,
} from "@/store/sectionsSlice";

const SectionAccordion = () => {
  const dispatch = useDispatch();

  const selectedCustomer = useSelector((s) => s.customers.selectedCustomer);
  const sections = useSelector((s) => s.sections.structure);
  const activeSection = useSelector((s) => s.sections.activeSection); // index
  const activeSub = useSelector((s) => s.sections.activeSub);         // index or null

  const [newSection, setNewSection] = React.useState("");
  const [newSub, setNewSub] = React.useState("");
  const [editing, setEditing] = React.useState({}); // key → {qty, rate}

  /* Load structure when customer changes */
  React.useEffect(() => {
    if (selectedCustomer?._id) {
      dispatch(fetchStructure(selectedCustomer._id));
    }
  }, [dispatch, selectedCustomer]);

  /* Auto-select first section */
  React.useEffect(() => {
    if (sections.length > 0 && activeSection === null) {
      dispatch(setActiveSection(0));
    }
  }, [sections, activeSection, dispatch]);

  /* Helpers */
  const sectionSubtotal = (sec) => {
    let sum = 0;

    // Global items
    sec.items?.forEach((it) => {
      const qty = it.quantity ?? it.qty ?? 0;
      const rate = it.rate ?? 0;
      sum += qty * rate;
    });

    // Subsection items
    sec.subsections?.forEach((sub) => {
      sub.items?.forEach((it) => {
        const qty = it.quantity ?? it.qty ?? 0;
        const rate = it.rate ?? 0;
        sum += qty * rate;
      });
    });

    return sum;
  };

  /* Add Section */
  const handleAddSection = () => {
    if (!newSection.trim() || !selectedCustomer?._id) return;

    dispatch(
      createSection({
        customerId: selectedCustomer._id,
        name: newSection.trim(),
      })
    ).then(() => {
      dispatch(fetchStructure(selectedCustomer._id));
    });

    setNewSection("");
  };

  /* Add Subsection */
  const handleAddSubsection = (sIndex) => {
    if (!newSub.trim() || !selectedCustomer?._id) return;

    const sec = sections[sIndex];
    if (!sec) return;

    dispatch(
      createSubsection({
        customerId: selectedCustomer._id,
        sectionId: sec.sectionId,
        name: newSub.trim(),
      })
    ).then(() => {
      dispatch(fetchStructure(selectedCustomer._id));
      dispatch(setActiveSection(sIndex));
    });

    setNewSub("");
  };

  /* Save edited assigned item (either global or inside subsection) */
  const saveEdit = (sIdx, subIdx, assignedId) => {
    const key = `${sIdx}-${subIdx ?? "g"}-${assignedId}`;
    const edit = editing[key];
    if (!edit || !selectedCustomer?._id) return;

    dispatch(
      updateAssignedItem({
        id: assignedId,
        data: {
          quantity: Number(edit.qty) || 0,
          rate: Number(edit.rate) || 0,
        },
      })
    ).then(() => {
      dispatch(fetchStructure(selectedCustomer._id));
      setEditing((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    });
  };

  /* Delete assigned item */
  const handleDeleteItem = (assignedId) => {
    if (!selectedCustomer?._id) return;

    dispatch(deleteAssignedItem(assignedId)).then(() => {
      dispatch(fetchStructure(selectedCustomer._id));
    });
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0 p-4 bg-primary-dark/20 border border-accent rounded-lg text-white overflow-hidden">
      {/* Header */}
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

      {/* Content */}
      <div
        className="flex-1 min-h-0 overflow-y-auto pr-2
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-accent/20
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-accent/40"
      >
        <Accordion
          type="single"
          collapsible
          className="w-full pb-2"
          value={activeSection !== null ? `sec-${activeSection}` : ""}
          onValueChange={(value) => {
            if (!value) return dispatch(setActiveSection(null));
            const index = parseInt(value.split("-")[1], 10);
            dispatch(setActiveSection(Number.isNaN(index) ? null : index));
          }}
        >
          {sections.map((sec, sIndex) => {
            const subtotal = sectionSubtotal(sec);
            const isSelected = activeSection === sIndex;

            return (
              <AccordionItem
                key={sec.sectionId || sIndex}
                value={`sec-${sIndex}`}
                className="border-b-0 mb-2"
              >
                <AccordionTrigger
                  className={`py-3 px-3 flex justify-between w-full rounded-md transition hover:bg-white/5 items-center
                    ${
                      isSelected
                        ? "bg-primary-dark/30 text-light-blue font-semibold border-l-4 border-accent pl-2"
                        : "text-white"
                    }`}
                >
                  <span
                    className={`text-xl text-left ${
                      isSelected ? "text-light-blue" : ""
                    }`}
                  >
                    {sec.sectionName || sec.name}
                  </span>
                  <span className="text-lg font-mono opacity-90 shrink-0 ml-2">
                    ₹ {subtotal.toFixed(2)}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="p-3 bg-black/20 rounded-b-md">
                  {/* Add Subsection */}
                  <div className="flex gap-2 my-2 w-full">
                    <Input
                      placeholder="Add Subsection"
                      value={isSelected ? newSub : ""}
                      onChange={(e) => setNewSub(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddSubsection(sIndex)
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleAddSubsection(sIndex)}
                    >
                      Add
                    </Button>
                  </div>

                  {/* Subsections */}
                  <div className="space-y-3 mt-3">
                    {sec.subsections?.map((sub, subIndex) => (
                      <div
                        key={sub.subsectionId || subIndex}
                        className={`border border-accent/30 rounded-lg p-3 cursor-pointer transition
                          ${
                            isSelected && activeSub === subIndex
                              ? "bg-accent/20 border-accent"
                              : "bg-primary-dark/10"
                          }`}
                        onClick={() => dispatch(setActiveSub(subIndex))}
                      >
                        <div className="flex justify-between items-center">
                          <strong className="text-lg">{sub.name}</strong>
                          <span className="text-sm font-mono">
                            ₹{" "}
                            {sub.items
                              ?.reduce((sum, it) => {
                                const qty = it.quantity ?? it.qty ?? 0;
                                const rate = it.rate ?? 0;
                                return sum + qty * rate;
                              }, 0)
                              .toFixed(2)}
                          </span>
                        </div>

                        {/* Items inside this subsection */}
                        <div className="mt-3 space-y-2">
                          {sub.items?.map((it) => {
                            const assignedId = it.id || it._id;
                            const key = `${sIndex}-${subIndex}-${assignedId}`;
                            const edit = editing[key];

                            const qty = it.quantity ?? it.qty ?? 0;
                            const rate = it.rate ?? 0;

                            return (
                              <div
                                key={assignedId}
                                className="flex justify-between items-center border border-accent/20 p-2 rounded gap-2"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">
                                    {it.name}
                                  </div>
                                  <div className="text-sm font-mono">
                                    ₹ {(qty * rate).toFixed(2)}
                                  </div>
                                </div>

                                {edit ? (
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Input
                                      type="number"
                                      className="w-16 h-8"
                                      value={edit.qty}
                                      onChange={(e) =>
                                        setEditing((prev) => ({
                                          ...prev,
                                          [key]: {
                                            ...edit,
                                            qty: e.target.value,
                                          },
                                        }))
                                      }
                                    />
                                    <Input
                                      type="number"
                                      className="w-20 h-8"
                                      value={edit.rate}
                                      onChange={(e) =>
                                        setEditing((prev) => ({
                                          ...prev,
                                          [key]: {
                                            ...edit,
                                            rate: e.target.value,
                                          },
                                        }))
                                      }
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8"
                                      onClick={() =>
                                        saveEdit(sIndex, subIndex, assignedId)
                                      }
                                    >
                                      Save
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-xs text-muted-foreground">
                                      x{qty}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 px-2"
                                      onClick={() =>
                                        setEditing((prev) => ({
                                          ...prev,
                                          [key]: { qty, rate },
                                        }))
                                      }
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-8 px-2"
                                      onClick={() =>
                                        handleDeleteItem(assignedId)
                                      }
                                    >
                                      Del
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Global Items in section */}
                    <div className="mt-4">
                      <strong className="text-lg">
                        Global Items in {sec.sectionName || sec.name}
                      </strong>

                      {sec.items?.map((it) => {
                        const assignedId = it.id || it._id;
                        const key = `${sIndex}-g-${assignedId}`;
                        const edit = editing[key];

                        const qty = it.quantity ?? it.qty ?? 0;
                        const rate = it.rate ?? 0;

                        return (
                          <div
                            key={assignedId}
                            className="flex justify-between items-center border border-accent/20 p-2 rounded mt-2 gap-2"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {it.name}
                              </div>
                              <div className="text-sm font-mono">
                                ₹ {(qty * rate).toFixed(2)}
                              </div>
                            </div>

                            {edit ? (
                              <div className="flex items-center gap-2 shrink-0">
                                <Input
                                  type="number"
                                  className="w-16 h-8"
                                  value={edit.qty}
                                  onChange={(e) =>
                                    setEditing((prev) => ({
                                      ...prev,
                                      [key]: {
                                        ...edit,
                                        qty: e.target.value,
                                      },
                                    }))
                                  }
                                />
                                <Input
                                  type="number"
                                  className="w-20 h-8"
                                  value={edit.rate}
                                  onChange={(e) =>
                                    setEditing((prev) => ({
                                      ...prev,
                                      [key]: {
                                        ...edit,
                                        rate: e.target.value,
                                      },
                                    }))
                                  }
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                  onClick={() =>
                                    saveEdit(sIndex, null, assignedId)
                                  }
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="text-xs text-muted-foreground">
                                  x{qty}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 px-2"
                                  onClick={() =>
                                    setEditing((prev) => ({
                                      ...prev,
                                      [key]: { qty, rate },
                                    }))
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 px-2"
                                  onClick={() => handleDeleteItem(assignedId)}
                                >
                                  Del
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-500">
                      Section Subtotal
                    </span>
                    <span className="text-xl font-bold text-green-200 font-mono">
                      ₹ {subtotal.toFixed(2)}
                    </span>
                  </div>
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
