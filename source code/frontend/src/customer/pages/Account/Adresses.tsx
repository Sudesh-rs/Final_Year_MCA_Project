import { type ChangeEvent, type FormEvent, useState } from 'react'
import { Alert, Box, Button, Grid, Modal, Snackbar, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import { addUserAddress, removeUserAddress } from '../../../Redux Toolkit/Customer/UserSlice'
import UserAddressCard from './UserAddressCard'
import type { Address } from '../../../types/userTypes'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(600px, calc(100vw - 48px))',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '1rem',
};

const defaultAddress: Address = {
  name: '',
  mobile: '',
  pinCode: '',
  address: '',
  locality: '',
  city: '',
  state: '',
};

const Addresses = () => {
  const { user } = useAppSelector((store) => store)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Address>(defaultAddress)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const jwt = localStorage.getItem('jwt') || ''

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setForm(defaultAddress)
  }

  const handleSnackbarClose = () => {
    setSuccessOpen(false)
    setErrorOpen(false)
    setErrorMessage('')
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRemoveAddress = async (addressId: string) => {
    setRemovingId(addressId)
    setLoading(true)
    try {
      await dispatch(removeUserAddress({ addressId, jwt })).unwrap()
      setSuccessOpen(true)
    } catch (error: any) {
      setErrorMessage(error || 'Failed to remove address')
      setErrorOpen(true)
    } finally {
      setRemovingId(null)
      setLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      await dispatch(addUserAddress({ address: form, jwt })).unwrap()
      setSuccessOpen(true)
      handleClose()
    } catch (error: any) {
      setErrorMessage(error || 'Failed to add address')
      setErrorOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='flex flex-col gap-4 mb-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Saved Addresses</h2>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Address
          </Button>
        </div>
        {!user.user?.addresses?.length && (
          <div className='p-4 border rounded-md text-gray-600'>
            No saved addresses yet. Click "Add Address" to add one.
          </div>
        )}
      </div>
      <div className='space-y-3'>
        {user.user?.addresses?.map((item) => (
          <UserAddressCard
            key={item._id}
            item={item}
            onRemove={() => handleRemoveAddress(item._id as string)}
            removing={removingId === item._id}
          />
        ))}
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h2 className='text-xl font-semibold mb-4'>Add New Address</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='name'
                  label='Name'
                  value={form.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='mobile'
                  label='Mobile'
                  value={form.mobile}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='pinCode'
                  label='Pin Code'
                  value={form.pinCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='address'
                  label='Address (House No, Building, Street)'
                  value={form.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='locality'
                  label='Locality/Town'
                  value={form.locality}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name='city'
                  label='City'
                  value={form.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name='state'
                  label='State'
                  value={form.state}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type='submit' variant='contained' color='primary' fullWidth disabled={loading}>
                  {loading ? 'Adding...' : 'Save Address'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <Snackbar open={successOpen} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity='success' sx={{ width: '100%' }}>
          Address added successfully. It will appear in checkout too.
        </Alert>
      </Snackbar>
      <Snackbar open={errorOpen} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity='error' sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Addresses
