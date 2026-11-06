'use client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export function SignOut() {
  const router = useRouter();
  return <button className="button-ghost !text-sm flex gap-1.5 items-center" onClick={async()=>{await supabaseBrowser().auth.signOut();router.push('/');router.refresh();}}><LogOut size={16}/> Sair</button>;
}
