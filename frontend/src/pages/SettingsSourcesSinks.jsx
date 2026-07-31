import { useState, useEffect } from 'react'
import { getSourcesSinks, createSourceSink, updateSourceSink, deleteSourceSink } from '../api/sourcesinks'

export default function SettingsSourcesSinks() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)
  const [confirmText, setConfirmText] = useState('')
  const [formData, setFormData] = useState({
    type: 'source',
    name: '',
    description: '',
  })
  const [formErrors, setFormErrors] = useState({})

  // Load sources and sinks on mount
  useEffect(() => {
    loadSourcesSinks()
  }, [])

  const loadSourcesSinks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSourcesSinks()
      setItems(data)
    } catch (err) {
      console.error('Failed to load sources and sinks:', err)
      setError('Failed to load sources and sinks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreateModal = () => {
    setEditingItem(null)
    setFormData({
      type: 'source',
      name: '',
      description: '',
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleOpenEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      type: item.type,
      name: item.name,
      description: item.description || '',
    })
    setFormErrors({})
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormErrors({})
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const payload = {
        type: formData.type,
        name: formData.name,
        description: formData.description,
      }

      if (editingItem) {
        await updateSourceSink(editingItem.id, payload)
      } else {
        await createSourceSink(payload)
      }
      await loadSourcesSinks()
      handleCloseModal()
    } catch (err) {
      console.error('Failed to save:', err)
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInitiateDelete = (itemId) => {
    setDeleteItemId(itemId)
    setConfirmText('')
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (confirmText !== 'CONFIRM') {
      alert('Please type CONFIRM to delete')
      return
    }

    try {
      setLoading(true)
      await deleteSourceSink(deleteItemId)
      await loadSourcesSinks()
      setShowDeleteConfirm(false)
      setConfirmText('')
      setDeleteItemId(null)
    } catch (err) {
      console.error('Failed to delete:', err)
      setError('Failed to delete. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setConfirmText('')
    setDeleteItemId(null)
  }

  const getTypeColor = (type) => {
    return type === 'source' ? '#10b981' : '#ef4444'
  }

  const getTypeLabel = (type) => {
    return type === 'source' ? 'Source' : 'Sink'
  }

  return (
    <div>
      {error && (
        <div style={styles.message}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={styles.header}>
        <h2 style={styles.title}>Manage Sources & Sinks</h2>
        <button
          style={styles.btnGlowing}
          onClick={handleOpenCreateModal}
          disabled={loading}
        >
          + Create New
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div style={styles.loading}>Loading sources and sinks...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created</th>
              <th style={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <span
                    style={{
                      ...styles.typeBadge,
                      backgroundColor: getTypeColor(item.type),
                    }}
                  >
                    {getTypeLabel(item.type)}
                  </span>
                </td>
                <td style={styles.nameCell}>
                  <strong>{item.name}</strong>
                </td>
                <td style={styles.descriptionCell}>
                  {item.description || '—'}
                </td>
                <td style={styles.dateCell}>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : '—'}
                </td>
                <td style={styles.actionsCell}>
                  <button
                    style={styles.btnEdit}
                    onClick={() => handleOpenEditModal(item)}
                    title="Edit"
                    disabled={loading}
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.btnDelete}
                    onClick={() => handleInitiateDelete(item.id)}
                    title="Delete"
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>
                {editingItem
                  ? 'Edit Source/Sink'
                  : 'Create New Source/Sink'}
              </h2>
              <button
                style={styles.closeBtn}
                onClick={handleCloseModal}
                disabled={loading}
              >
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type *</label>
                  <select
                    style={styles.select}
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    disabled={loading || editingItem}
                  >
                    <option value="source">Source (Green)</option>
                    <option value="sink">Sink (Red)</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Name *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Employer, Rent"
                    disabled={loading}
                  />
                  {formErrors.name && (
                    <div style={styles.error}>{formErrors.name}</div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    style={styles.textarea}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Optional description"
                    rows="3"
                    disabled={loading}
                  />
                </div>

                <div style={styles.modalFooter}>
                  <button
                    type="button"
                    style={styles.btnCancel}
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={styles.btnSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={styles.modalOverlay} onClick={handleCancelDelete}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>Confirm Delete</h2>
              <button
                style={styles.closeBtn}
                onClick={handleCancelDelete}
                disabled={loading}
              >
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.warningMessage}>
                <strong>Warning:</strong> This action cannot be undone. Please
                type <strong>CONFIRM</strong> to delete this item.
              </div>

              <div style={styles.formGroup}>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Type CONFIRM to delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div style={styles.modalFooter}>
                <button
                  style={styles.btnCancel}
                  onClick={handleCancelDelete}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...styles.btnSubmit,
                    backgroundColor:
                      confirmText === 'CONFIRM' ? '#ef4444' : '#d1d5db',
                    cursor: confirmText === 'CONFIRM' ? 'pointer' : 'not-allowed',
                  }}
                  onClick={handleConfirmDelete}
                  disabled={loading || confirmText !== 'CONFIRM'}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  btnGlowing: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
    transition: 'all 0.3s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  message: {
    padding: '12px 16px',
    marginBottom: '16px',
    borderRadius: '6px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderLeft: '4px solid #ef4444',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#6b7280',
  },
  typeBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
  },
  nameCell: {
    fontWeight: '500',
    color: '#1f2937',
  },
  descriptionCell: {
    fontSize: '13px',
    color: '#6b7280',
  },
  dateCell: {
    fontSize: '13px',
    color: '#6b7280',
  },
  actionsHeader: {
    textAlign: 'center',
  },
  actionsCell: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  btnEdit: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
    transition: 'transform 0.2s',
    color: '#3b82f6',
  },
  btnDelete: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
    transition: 'transform 0.2s',
    color: '#ef4444',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: 0,
    width: '32px',
    height: '32px',
  },
  modalBody: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#1f2937',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '4px',
  },
  warningMessage: {
    padding: '12px 16px',
    marginBottom: '20px',
    borderRadius: '6px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderLeft: '4px solid #f59e0b',
  },
  modalFooter: {
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  btnCancel: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
  },
  btnSubmit: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: 'white',
  },
}
