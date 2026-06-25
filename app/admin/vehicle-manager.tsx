"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import type { AnyCar, RentalCar, SaleCar } from "@/lib/cars"
import { saveVehicleAction, deleteVehicleAction, type ActionState } from "./actions"

const initial: ActionState = {}

function SaveButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Saving..." : isNew ? "Add vehicle" : "Save changes"}
    </button>
  )
}

function Field({
  label,
  name,
  defaultValue = "",
  placeholder,
  type = "text",
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
  type?: string
}) {
  return (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}</label>
      <input id={`f-${name}`} name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} />
    </div>
  )
}

function VehicleForm({
  car,
  kind,
  onDone,
}: {
  car?: AnyCar
  kind: "sale" | "rental"
  onDone: () => void
}) {
  const router = useRouter()
  const [state, formAction] = useActionState(saveVehicleAction, initial)
  const isNew = !car
  const sale = car?.kind === "sale" ? (car as SaleCar) : undefined
  const rental = car?.kind === "rental" ? (car as RentalCar) : undefined

  useEffect(() => {
    if (state.success) {
      router.refresh()
      onDone()
    }
  }, [state.success, router, onDone])

  return (
    <form action={formAction} className="form vehicle-form">
      <input type="hidden" name="id" value={car?.id ?? ""} />
      <input type="hidden" name="kind" value={kind} />

      <div className="vehicle-form-head">
        {car?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="vehicle-form-thumb" src={car.image || "/placeholder.svg"} alt="" />
        )}
        <h4 className="h-md">
          {isNew ? `New ${kind === "sale" ? "for-sale" : "rental"} vehicle` : `Editing ${car?.name}`}
        </h4>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <Field label="Vehicle name" name="name" defaultValue={car?.name} placeholder="e.g. Mazda 3 BK" />
        <div className="field">
          <label htmlFor="f-status">Status</label>
          <select id="f-status" name="status" defaultValue={car?.status ?? "available"}>
            <option value="available">Available now</option>
            <option value="coming-soon">Coming soon (covered)</option>
          </select>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <Field label="Display price" name="price" defaultValue={car?.price} placeholder="$14,990 or From $129 / day" />
        <Field
          label="Checkout amount (AUD)"
          name="amount"
          defaultValue={car ? String(car.amountCents / 100) : ""}
          placeholder="14990"
          type="number"
        />
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <Field label="Transmission" name="trans" defaultValue={car?.trans} placeholder="Automatic" />
        <Field label="Seats" name="seats" defaultValue={car?.seats} placeholder="5 Seats" />
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <Field label="Doors" name="doors" defaultValue={car?.doors} placeholder="4 Doors" />
        <Field label="Fuel" name="fuel" defaultValue={car?.fuel} placeholder="Petrol" />
      </div>

      {kind === "sale" ? (
        <>
          <div className="grid-2" style={{ gap: 16 }}>
            <Field label="Engine" name="engine" defaultValue={sale?.engine} placeholder="2.0L" />
            <Field label="Year" name="year" defaultValue={sale?.year} placeholder="2011" />
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            <Field label="Odometer" name="odometer" defaultValue={sale?.odometer} placeholder="98,500 km" />
            <Field label="Body" name="body" defaultValue={sale?.body} placeholder="Sedan" />
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            <Field label="Colour" name="color" defaultValue={sale?.color} placeholder="Crystal White" />
            <Field label="Drivetrain" name="drivetrain" defaultValue={sale?.drivetrain} placeholder="Front-Wheel Drive" />
          </div>
          <Field label="Registration" name="rego" defaultValue={sale?.rego} placeholder="Registered until 09/2025" />
        </>
      ) : (
        <div className="grid-2" style={{ gap: 16 }}>
          <Field label="Luggage" name="bags" defaultValue={rental?.bags} placeholder="3 Bags" />
          <Field label="Deposit" name="deposit" defaultValue={rental?.deposit} placeholder="$129 due today to reserve" />
        </div>
      )}

      <div className="field">
        <label htmlFor="f-description">Description</label>
        <textarea id="f-description" name="description" defaultValue={car?.description} rows={4} placeholder="Describe the vehicle..." />
      </div>

      <div className="field">
        <label htmlFor="f-features">Features (one per line)</label>
        <textarea
          id="f-features"
          name="features"
          defaultValue={car?.features?.join("\n")}
          rows={5}
          placeholder={"Air conditioning\nCruise control\nBluetooth audio"}
        />
      </div>

      <div className="field">
        <label htmlFor="f-image">Vehicle photo {car ? "(leave empty to keep current)" : ""}</label>
        <input id="f-image" name="image" type="file" accept="image/*" className="admin-file" />
      </div>

      <div className="vehicle-form-actions">
        <SaveButton isNew={isNew} />
        <button type="button" className="btn btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>

      {state.error && <p className="scan-msg scan-msg-error">{state.error}</p>}
    </form>
  )
}

function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [state, formAction] = useActionState(deleteVehicleAction, initial)

  useEffect(() => {
    if (state.success) router.refresh()
  }, [state.success, router])

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(`Remove "${name}" from the catalog? This cannot be undone.`)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-ghost btn-danger">
        Delete
      </button>
    </form>
  )
}

function VehicleRow({ car, onEdit }: { car: AnyCar; onEdit: () => void }) {
  return (
    <div className="vehicle-admin-row card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="vehicle-admin-thumb" src={car.image || "/placeholder.svg"} alt={car.name} />
      <div className="vehicle-admin-info">
        <div className="vehicle-admin-name">
          <h4>{car.name}</h4>
          <span className={`pill ${car.status === "coming-soon" ? "pill-soon" : "pill-live"}`}>
            {car.status === "coming-soon" ? "Coming soon" : "Available"}
          </span>
        </div>
        <p className="vehicle-admin-meta">
          {car.price} · {car.trans} · {car.seats}
        </p>
      </div>
      <div className="vehicle-admin-actions">
        <button type="button" className="btn btn-ghost" onClick={onEdit}>
          Edit
        </button>
        <DeleteButton id={car.id} name={car.name} />
      </div>
    </div>
  )
}

export function VehicleManager({ sales, rentals }: { sales: SaleCar[]; rentals: RentalCar[] }) {
  // `editing` holds the open editor: { mode: "edit", car } or { mode: "new", kind }
  const [editing, setEditing] = useState<
    { mode: "edit"; car: AnyCar } | { mode: "new"; kind: "sale" | "rental" } | null
  >(null)

  const close = () => setEditing(null)

  return (
    <div className="vehicle-manager">
      <div className="vehicle-manager-toolbar">
        <button type="button" className="btn btn-primary" onClick={() => setEditing({ mode: "new", kind: "sale" })}>
          + Add for-sale vehicle
        </button>
        <button type="button" className="btn btn-outline" onClick={() => setEditing({ mode: "new", kind: "rental" })}>
          + Add rental vehicle
        </button>
      </div>

      {editing && (
        <div className="vehicle-editor-wrap">
          <VehicleForm
            key={editing.mode === "edit" ? editing.car.id : `new-${editing.kind}`}
            car={editing.mode === "edit" ? editing.car : undefined}
            kind={editing.mode === "edit" ? editing.car.kind : editing.kind}
            onDone={close}
          />
        </div>
      )}

      <div className="vehicle-admin-group">
        <h3 className="h-md">For sale ({sales.length})</h3>
        <div className="vehicle-admin-list">
          {sales.map((car) => (
            <VehicleRow key={car.id} car={car} onEdit={() => setEditing({ mode: "edit", car })} />
          ))}
          {sales.length === 0 && <p className="admin-sub">No for-sale vehicles yet.</p>}
        </div>
      </div>

      <div className="vehicle-admin-group">
        <h3 className="h-md">Rentals ({rentals.length})</h3>
        <div className="vehicle-admin-list">
          {rentals.map((car) => (
            <VehicleRow key={car.id} car={car} onEdit={() => setEditing({ mode: "edit", car })} />
          ))}
          {rentals.length === 0 && <p className="admin-sub">No rental vehicles yet.</p>}
        </div>
      </div>
    </div>
  )
}
