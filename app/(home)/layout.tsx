import Header from "@/app/_components/layout/header/Header";
import { getUser } from "@/lib/supabese/server/session";
import { createClient } from "@/utils/supabase/server";
import Footer from "../_components/layout/footer/Footer";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { user } = await getUser();

  let coupleId: string | undefined = undefined;

  if (user) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("couples")
      .select("custom_couple_id")
      .or(`primary_user_id.eq.${user.id},partner_user_id.eq.${user.id}`);

    if (!error && data.length > 0) {
      coupleId = data[0].custom_couple_id
    }
  }

  return (
    <>
      <Header coupleId={coupleId} user={user} />
      <main className="pt-[60px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
