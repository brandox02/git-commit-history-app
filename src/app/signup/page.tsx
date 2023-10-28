'use client';

import { Button } from '@mantine/core';
import TextInput from "@/components/TextInput";
import axios, { TOKEN_KEY } from '@/config/axios'
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const defaultValues = {
   email: '',
   password: '',
   passwordConfirmation: '',
   firstname: '',
   lastname: '',
}

const validationSchema = z.object(
   Object.keys(defaultValues)
      .reduce((acc, key) => ({
         ...acc,
         [key]: z.string().min(1, { message: 'This field is required' }),
         email: z.string().email(),

      }), {})
).refine((data: any) => data.password == data.passwordConfirmation, {
   message: 'Passwords do not match',
   path: ['passwordConfirmation']
});

export default function Login() {

   const methods = useForm({
      defaultValues,
      resolver: zodResolver(validationSchema)
   });

   const {
      mutateAsync: signupMutation,
      isPending: isLoadingsignupMutation,
   } = useMutation({
      mutationFn: async (payload: {
         email: string,
         password: string
      }) => axios.post('/users', payload),
      mutationKey: ['/users']
   });

   const router = useRouter();


   const onSignUp = async () => {
      const email = methods.watch('email');
      const password = methods.watch('password');
      try {
         if (!password.trim() || !email.trim()) {
            toast.error('You need to complete both the password and email fields');
            return;
         }
         const response = await signupMutation({
            password, email
         })


         if (response.data) {
            router.replace('/commit-history');
            Cookies.set(TOKEN_KEY, JSON.stringify(response.data))
         }

      } catch (error: any) {
         console.log({ error })
         if (error?.response?.data?.message === 'user or password wrong') {
            toast.error('User or password are wrong');
         }
      }

   }



   return (
      <FormProvider {...methods}>
         <form onSubmit={methods.handleSubmit(onSignUp)}>
            <div className="bg-[#F1F6FF] w-screen h-screen">
               <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                  <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
                     <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                           Sign Up
                        </h1>
                        <div className="flex flex-col gap-2">
                           <TextInput
                              name='firstname'
                              label="Firsname"
                              className=""

                           />
                           <TextInput
                              name='lastname'
                              label="Lastname"
                              className=""
                           />
                           <TextInput
                              name='email'
                              label="Email"
                              className=""

                           />
                           <TextInput
                              name='password'
                              type='password'
                              label="Password"
                              className=""

                           />
                           <TextInput
                              name='passwordConfirmation'
                              type='password'
                              label="Password Confirmation"
                              className=""

                           />
                           <Button
                              type='submit'
                              variant={'filled'}
                              loading={isLoadingsignupMutation}
                           >Sign Up</Button>
                        </div>
                     </div>
                  </div>
               </div>

            </div >
         </form>
      </FormProvider>
   )
}