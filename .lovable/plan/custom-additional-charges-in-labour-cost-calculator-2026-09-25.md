# Custom additional charges in Labour Cost Calculator

Let visitors add their own extra charges (e.g. "Transport cost ₹50 per worker per day") to the costing table.

## What changes

1. **Inputs panel** — new "Custom charges" block (below the Workers/Days fields):
   - "Add charge" button adds a row with two fields: **Charge name** (text, e.g. "Transport") and **Amount per day** (₹ number).
   - Each row has a small remove (×) button.
   - Users can add multiple custom charges.

2. **Costing table** — custom charges appear as extra rows inside the **Statutory & Additional Charges** section, each showing its name and "Per day" as the calculation note. They are added into the **Additional Charges Total (B)**, so they flow through the rest of the calculation (service charge %, GST, grand total, monthly totals) exactly like PF/ESIC/bonus.

3. **Summary cards & breakdown bar** — update automatically since custom charges are part of B.

4. **Reset button** — clears custom charges back to none.

## Example

With Basic 520 + DA 200 and a custom "Transport ₹50/day":
- B = Leave + PF + ESIC + Bonus + 50 (Transport)
- Service charge and GST then apply on the higher total, same as your sheet.

## Technical

- `src/lib/costing.ts`: add `customCharges: { name: string; amount: number }[]` to `CostInputs`; sum their amounts into `b` in `calculateCost`.
- `src/pages/LabourCostCalculator.tsx`: add/edit/remove UI for custom charges in the inputs panel; render a `Row` per custom charge in the table between Bonus and the B subtotal.
