'use client';

import { Button } from '@mantine/core';
import Card from "@/components/Card";
import Loader from "@/components/Loader";
import TextInput from "@/components/TextInput";
import axios from "@/config/axios";
import { Text } from "@mantine/core";
import { useQuery } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';

interface CommitAuthorClass {
   name: string;
   email: string;
   date: Date;
}

interface Commit {
   author: CommitAuthorClass;
   committer: CommitAuthorClass;
   message: string;
   url: string;
   comment_count: number
   id: string,
   avatar_url: string
}

interface Form {
   username: string, repo: string
}

export default function App() {
   const methods = useForm<Form>({
      defaultValues: {
         username: 'brandox02',
         repo: 'commit-history-api'
      }
   });

   const { data, isLoading, refetch } = useQuery({
      queryKey: ['/commit-history', JSON.stringify(methods.getValues())],
      queryFn: () => axios.get('/commit-history', { params: methods.getValues() })
   });



   const onSubmit = (data: Form) => refetch()

   const commits: Commit[] = data?.data || [];

   if (isLoading) {
      return (
         <Loader />
      )
   }

   return <div className="bg-[#F8F9FA] w-full p-10 relative">
      <Text
         className="sticky top-0"
         align="center"
         size="xl"
         fw={900}
         variant="gradient"
         gradient={{ from: 'blue', to: 'cyan', deg: 215 }}
      >Commit History App</Text>
      <div className="flex gap-10 w-full justify-center mt-16 flex-row">
         <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
               <TextInput
                  label="Username"
                  className=""
                  name='username'

               />
               <TextInput
                  label="Repository Name"
                  className=""
                  name='repo'
               />
               <Button
                  className='w-full '
                  type='submit'
                  onClick={() => { }}
                  variant={'filled'}
                  loading={isLoading}
               >Ingresar</Button>
            </form>
         </FormProvider>
      </div>
      {commits.length ? (
         <div className="flex justify-center gap-5 flex-col items-center mt-10" >
            {commits.map(({ id, author, message, url, avatar_url }) => (
               <div
                  key={id}
               >
                  <Card
                     commit={message}
                     commitUrl={url}
                     date={author.date}
                     email={author.email}
                     fullname={author.name}
                     photoUrl={avatar_url}
                  />
               </div>
            ))}
         </div>
      ) : 'There is not data to show'}
   </div>
}