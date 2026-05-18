import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Address } from '../../../types/userTypes'

const UserAddressCard = ({
  item,
  onRemove,
  removing,
}: {
  item: Address
  onRemove: () => void
  removing?: boolean
}) => {
  return (
    <div className='p-5 border rounded-md flex flex-col sm:flex-row justify-between items-start gap-4'>
      <div className='space-y-3'>
        <h1 className='font-semibold'>{item.name}</h1>
        <p className='w-full sm:w-[320px]'>
          {item.address}, {item.locality}, {item.city}, {item.state} - {item.pinCode}
        </p>
        <p>
          <strong>Mobile :</strong> {item.mobile}
        </p>
      </div>
      <Button
        variant='outlined'
        color='error'
        startIcon={<DeleteIcon />}
        onClick={onRemove}
        disabled={removing}
      >
        {removing ? 'Removing...' : 'Remove'}
      </Button>
    </div>
  )
}

export default UserAddressCard