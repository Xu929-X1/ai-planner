import React from 'react'
import { Input } from './UI/input'
import { Button } from './UI/button';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
export default function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
        <div className='w-full relative justify-center align-middle'>
            <Input type={
                showPassword ? 'text' : 'password'
            } {...props} className='pr-10' />
            <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent"

            >
                {
                    showPassword ? <VisibilityOffIcon sx={{
                        ":hover": {
                            opacity: 0.7
                        }
                    }} /> : <VisibilityIcon sx={{
                        ":hover": {
                            opacity: 0.7
                        }
                    }} />
                }
            </Button>
        </div>
    )
}
