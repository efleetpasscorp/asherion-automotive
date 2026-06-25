"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { saveSocialSettingsAction, testMetaConnectionAction, type ActionState } from "./actions"

const initial: ActionState = {}

type Props = {
  instagramUrl: string
  facebookUrl: string
  facebookPageId: string
  hasToken: boolean
  updatedAt: string | null
}

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Saving..." : "Save settings"}
    </button>
  )
}

function TestButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-ghost" disabled={pending}>
      {pending ? "Testing..." : "Test connection"}
    </button>
  )
}

export function SocialSettingsManager({ instagramUrl, facebookUrl, facebookPageId, hasToken, updatedAt }: Props) {
  const router = useRouter()
  const [saveState, saveAction] = useActionState(saveSocialSettingsAction, initial)
  const [testState, testAction] = useActionState(testMetaConnectionAction, initial)

  useEffect(() => {
    if (saveState.success) router.refresh()
  }, [saveState.success, router])

  return (
    <div className="social-settings">
      <form action={saveAction} className="social-form card">
        <div className="social-group">
          <h3 className="h-sm">Profile links</h3>
          <p className="admin-sub" style={{ marginBottom: 16 }}>
            Shown as the &ldquo;See more reviews&rdquo; icons in the reviews section and footer.
          </p>
          <div className="field">
            <label htmlFor="instagramUrl">Instagram profile URL</label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              type="url"
              defaultValue={instagramUrl}
              placeholder="https://instagram.com/yourpage"
            />
          </div>
          <div className="field">
            <label htmlFor="facebookUrl">Facebook page URL</label>
            <input
              id="facebookUrl"
              name="facebookUrl"
              type="url"
              defaultValue={facebookUrl}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
        </div>

        <div className="social-group">
          <h3 className="h-sm">Live Facebook reviews (Graph API)</h3>
          <p className="admin-sub" style={{ marginBottom: 16 }}>
            Connect a Facebook Page to pull live recommendations into the reviews section. You&apos;ll
            need a <b>Page access token</b> with <code>pages_read_engagement</code> from a Meta
            developer app. Until connected (or if Meta blocks the request), the section falls back to
            the built-in sample reviews.
          </p>
          <div className="field">
            <label htmlFor="facebookPageId">Facebook Page ID</label>
            <input
              id="facebookPageId"
              name="facebookPageId"
              type="text"
              defaultValue={facebookPageId}
              placeholder="e.g. 1234567890"
            />
          </div>
          <div className="field">
            <label htmlFor="facebookAccessToken">Page access token</label>
            <input
              id="facebookAccessToken"
              name="facebookAccessToken"
              type="password"
              autoComplete="off"
              placeholder={hasToken ? "•••••••• (saved — leave blank to keep)" : "Paste your Page access token"}
            />
            <span className="field-hint">
              {hasToken ? "A token is saved. Leave blank to keep it, or paste a new one to replace." : "Stored encrypted at rest."}
            </span>
          </div>
        </div>

        {saveState.error && <p className="admin-msg admin-msg-error">{saveState.error}</p>}
        {saveState.success && <p className="admin-msg admin-msg-success">{saveState.success}</p>}

        <div className="social-actions">
          <SaveButton />
          {updatedAt && (
            <span className="td-admin-date">Last updated {new Date(updatedAt).toLocaleString()}</span>
          )}
        </div>
      </form>

      <form action={testAction} className="social-test">
        <TestButton />
        {testState.error && <p className="admin-msg admin-msg-error">{testState.error}</p>}
        {testState.success && <p className="admin-msg admin-msg-success">{testState.success}</p>}
      </form>

      <div className="card social-note">
        <h4 className="h-sm">Note on Instagram</h4>
        <p className="admin-sub" style={{ margin: 0 }}>
          Instagram&apos;s APIs do not expose reviews or recommendations, so live Instagram reviews
          can&apos;t be pulled. The Instagram link above points visitors to your profile, and you can
          showcase Instagram feedback by adding it as a manual review if needed.
        </p>
      </div>
    </div>
  )
}
