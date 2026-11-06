-- Supabase default table privileges can include TRUNCATE and DELETE; forum writes must go through RLS.
revoke all on public.community_posts, public.community_replies from public, anon, authenticated;
grant select, insert, update on public.community_posts to authenticated;
grant select, insert, update on public.community_replies to authenticated;
