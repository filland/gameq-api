
DROP TABLE public.participant;
DROP TABLE public.vote;
DROP TABLE public.queue;
DROP TABLE public."user";




INSERT INTO public."user"(id, username, email, password) VALUES 
('b366c751-1e5f-4f30-a898-fec5cad27678', 'user1', 'user1@example.com', '$2b$10$ACwn20JXrxne5nvlJkY.puSG0AjALBtuGx74JQ0s4ygEQlIO8tKlW');

INSERT INTO public."user"(id, username, email, password) VALUES 
('c8ccdaa1-8390-4b9e-a7f6-120d2e0d2464', 'user2', 'user2@example.com', '$2b$10$ACwn20JXrxne5nvlJkY.puSG0AjALBtuGx74JQ0s4ygEQlIO8tKlW');

INSERT INTO public."user"(id, username, email, password) VALUES 
('fe94ab1c-b91e-4b8a-b5f1-c5378a4b87ac', 'user3', 'user3@example.com', '$2b$10$ACwn20JXrxne5nvlJkY.puSG0AjALBtuGx74JQ0s4ygEQlIO8tKlW');

INSERT INTO public."user"(id, username, email, password) VALUES 
('a6e63f47-b222-4090-aa0b-596d0f20f429', 'user4', 'user4@example.com', '$2b$10$ACwn20JXrxne5nvlJkY.puSG0AjALBtuGx74JQ0s4ygEQlIO8tKlW');

INSERT INTO public."user"(id, username, email, password) VALUES 
('4c03e6d9-e4e7-4b88-b803-3f4becc69999', 'user5', 'user5@example.com', '$2b$10$ACwn20JXrxne5nvlJkY.puSG0AjALBtuGx74JQ0s4ygEQlIO8tKlW');

INSERT INTO public."user"(id, username, email, password) VALUES 
('9bb1c3cf-ae39-4807-99a0-4e645e771ac7', 'user6', 'user6@example.com', '$2b$10$ACwn20JXrxne5nvlJkY.puSG0AjALBtuGx74JQ0s4ygEQlIO8tKlW');




INSERT INTO public.queue (id, description, number_of_winners, close_date, created_date, closed, "ownerId") values
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', 'queue1', 2, '2021-07-23T18:54:23.098Z', '2021-07-20T18:54:23.098Z', false, 'b366c751-1e5f-4f30-a898-fec5cad27678');



INSERT INTO public.participant ("queueId", "userId") values
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', 'b366c751-1e5f-4f30-a898-fec5cad27678'),
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', 'c8ccdaa1-8390-4b9e-a7f6-120d2e0d2464'),
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', 'fe94ab1c-b91e-4b8a-b5f1-c5378a4b87ac'),
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', 'a6e63f47-b222-4090-aa0b-596d0f20f429'),
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', '4c03e6d9-e4e7-4b88-b803-3f4becc69999'),
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', '9bb1c3cf-ae39-4807-99a0-4e645e771ac7');


INSERT INTO public.vote ("queueId", "voterId", "participantId") values
-- vote for user2
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', 'b366c751-1e5f-4f30-a898-fec5cad27678', 'c8ccdaa1-8390-4b9e-a7f6-120d2e0d2464'),
-- vote for user2
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', 'c8ccdaa1-8390-4b9e-a7f6-120d2e0d2464', 'c8ccdaa1-8390-4b9e-a7f6-120d2e0d2464'),
-- vote for user4
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', 'fe94ab1c-b91e-4b8a-b5f1-c5378a4b87ac', 'a6e63f47-b222-4090-aa0b-596d0f20f429'),
-- vote for user4
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', 'a6e63f47-b222-4090-aa0b-596d0f20f429', 'a6e63f47-b222-4090-aa0b-596d0f20f429'),
-- vote for user1
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', '4c03e6d9-e4e7-4b88-b803-3f4becc69999', 'b366c751-1e5f-4f30-a898-fec5cad27678'),
-- vote for user2
('fe1ac3ba-e87a-44fe-896d-722bbd09abc2', '9bb1c3cf-ae39-4807-99a0-4e645e771ac7', 'c8ccdaa1-8390-4b9e-a7f6-120d2e0d2464');
-- user2 = 3 votes, user4 = 2 votes, user1 = 1 vote, user3 = 0, user5 = 0



-- select that shows votes of participants for the queue
select u."username", v."participantId", v."numberOfVotes"
from public."user" u
inner join (
	select v."participantId" as "participantId", count("voterId") as "numberOfVotes" 
	from public.vote v
	where "queueId" = 'fe1ac3ba-e87a-44fe-896d-722bbd09abc2'
	group by "participantId"
) v
on u.id = v."participantId"
order by v."numberOfVotes" desc;




