-- Migration 002: chapter content fields + full 12-chapter seed
-- Run in Supabase SQL Editor. Idempotent (uses IF NOT EXISTS / ON CONFLICT DO UPDATE).
--
-- Adds:
--   chapters.simple_meaning       — plain-language explanation of the chapter
--   chapters.key_insights         — array of 3-4 lesson bullets
--   chapters.reflection_question  — single prompt shown to the reader
--
-- Seeds the canonical 12-chapter narrative from MusaQuest Content Structure.docx.
-- Existing rows are upserted by id; nothing is deleted.
--
-- Re-running this script is safe.

ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS simple_meaning      text;
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS key_insights        text[];
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS reflection_question text;

INSERT INTO public.chapters
  (id, slug, number, title, subtitle, body_md,
   surah, verse_number, arabic_translation,
   simple_meaning, key_insights, reflection_question,
   xp_reward, is_published)
VALUES
-- ─── Chapter 1 ──────────────────────────────────────────────────────────────
  (1, 'the-river-cradle', 1, 'The River Cradle',
   $sub$A baby is placed in a basket, carried by the river, and protected by Allah.$sub$,
   $body$A long time ago, the people of Bani Isra'il were living under a cruel ruler called Pharaoh. He was powerful, proud, and unfair. Families were afraid, and Musa's mother worried deeply for her baby son.

Allah inspired Musa's mother with a brave and difficult choice. She should nurse baby Musa, and when she feared for his safety, she should place him in the river. Allah promised that Musa would be returned to her and that he would one day become one of His messengers.

So Musa's mother placed her baby in a basket and trusted Allah. The river carried the basket away, but Musa was never truly alone. Allah was watching over him.

The basket reached Pharaoh's household. This could have seemed like the most dangerous place of all, but Allah's plan was greater than anyone's fear. Pharaoh's wife saw baby Musa and wanted him to be protected.

What looked scary became part of Allah's mercy. Musa's journey had begun.$body$,
   'Al-Qasas', 7,
   $tr$Allah inspired Musa's mother to place him in the river and promised to return him to her.$tr$,
   $sm$Allah told Musa's mother not to be afraid. Allah promised to protect baby Musa and return him to her.$sm$,
   ARRAY[
     $i$Allah protects whom He wills.$i$,
     $i$Trusting Allah can be hard, but Allah's promise is true.$i$,
     $i$Sometimes Allah's plan begins in a way we do not expect.$i$
   ],
   $rq$What can you learn from Musa's mother trusting Allah?$rq$,
   100, true),

-- ─── Chapter 2 ──────────────────────────────────────────────────────────────
  (2, 'the-palace-walls', 2, 'The Palace Walls',
   $sub$Musa grows up in Pharaoh's palace, but Allah's plan is already unfolding.$sub$,
   $body$Baby Musa was taken into Pharaoh's palace. Pharaoh was the ruler who had caused so much fear, but Allah made a way for Musa to be safe even there.

Pharaoh's wife saw Musa and felt kindness towards him. She asked that he should not be harmed. She hoped he might bring joy to the household or be adopted as a son.

Musa's mother was still worried. Her heart felt empty because she missed her baby so much. She told Musa's sister to follow him from a distance and watch carefully.

Allah had already planned a beautiful return. Baby Musa would not feed from the women in the palace. Then Musa's sister gently suggested a family who could care for him. By Allah's mercy, Musa was returned to his own mother so she could nurse him and feel comfort again.

Musa grew up surrounded by palace walls, but his life belonged to Allah's plan. Even when people thought they were in control, Allah was guiding every step.$body$,
   'Al-Qasas', 9,
   $tr$Pharaoh's wife asked that Musa should not be killed, and Allah returned Musa to his mother so her heart could be comforted (28:9 and 28:13).$tr$,
   $sm$Allah protected Musa in Pharaoh's own palace and returned him to his mother.$sm$,
   ARRAY[
     $i$Allah can create safety in unexpected places.$i$,
     $i$A mother's love is precious.$i$,
     $i$Allah's promise always comes true.$i$
   ],
   $rq$How did Allah protect Musa in a place that seemed dangerous?$rq$,
   100, true),

-- ─── Chapter 3 ──────────────────────────────────────────────────────────────
  (3, 'the-journey-to-midian', 3, 'The Journey to Midian',
   $sub$A story about courage when there is nowhere left to go, and small kindnesses that change everything.$sub$,
   $body$When Musa grew older, a serious accident happened in Egypt. Musa had tried to help someone, but a man died after being struck. Musa knew this was wrong and immediately turned to Allah, asking for forgiveness.

Soon, a man came running from the far side of the city. He warned Musa that powerful people were planning to harm him. Musa knew he could not stay in Egypt any longer.

He left the city afraid and watchful. He had no army, no map, and no clear plan. But he had something more important: trust in Allah. Musa prayed for Allah to save him from the wrongdoing people and guide him to the right path.

Musa travelled across the desert until he reached the water of Midian. There, he saw people watering their animals. Away from the crowd, two women were waiting with their flock because they could not move forward until the stronger shepherds had finished.

Musa was tired, but he still helped them. He watered their animals, then sat in the shade and made dua to Allah. That quiet act of kindness would open a new chapter in his life.$body$,
   'Al-Qasas', 21,
   $tr$Musa left Egypt in fear, asked Allah for help, travelled towards Midian, and helped two women at the well (28:21 to 28:24).$tr$,
   $sm$Musa made a mistake, asked Allah for forgiveness, left danger behind, and still chose to help others.$sm$,
   ARRAY[
     $i$When we make a mistake, we should turn back to Allah.$i$,
     $i$Courage can mean taking the next right step.$i$,
     $i$Helping others matters, even when we are tired.$i$,
     $i$Allah can guide us when we feel lost.$i$
   ],
   $rq$What is one lesson you learned from Musa's journey to Midian?$rq$,
   100, true),

-- ─── Chapter 4 ──────────────────────────────────────────────────────────────
  (4, 'the-years-in-midian', 4, 'The Years in Midian',
   $sub$Musa finds safety, work, family, and a new beginning.$sub$,
   $body$After Musa helped the two women at the well, one of them returned to him. She walked with modesty and told Musa that her father wanted to meet him and reward him for his help.

Musa went with her and told the old man what had happened in Egypt. The old man listened and comforted him. He told Musa that he was now safe from the wrongdoing people.

One of the daughters recognised something special in Musa. She said that he was strong and trustworthy. These two qualities mattered. Musa had strength, but he also had honesty and good character.

The old man offered Musa a new life in Midian. Musa could work for him for a number of years and marry one of his daughters. Musa accepted the agreement.

In Midian, Musa was no longer running through the desert afraid. Allah had given him shelter, work, family, and time to grow. Sometimes Allah takes us through hardship to prepare us for something greater.$body$,
   'Al-Qasas', 25,
   $tr$The old man of Midian welcomed Musa, recognised his safety, and made an agreement with him (28:25 to 28:28).$tr$,
   $sm$Allah gave Musa safety, work, and a new family after a difficult journey.$sm$,
   ARRAY[
     $i$Good character matters.$i$,
     $i$Being strong and trustworthy is a beautiful combination.$i$,
     $i$Allah can replace fear with safety.$i$,
     $i$Hard times can prepare us for something important.$i$
   ],
   $rq$Why do you think being trustworthy is so important?$rq$,
   100, true),

-- ─── Chapter 5 ──────────────────────────────────────────────────────────────
  (5, 'the-burning-tree', 5, 'The Burning Tree',
   $sub$Musa sees a fire and is called by Allah.$sub$,
   $body$After many years in Midian, Musa travelled with his family. During the journey, he saw a fire in the distance. He told his family to wait while he went towards it. He hoped to bring back a torch or find guidance.

When Musa reached the fire, something amazing happened. He was called by name: "O Musa." Allah told him that He was his Lord. Musa was standing in a sacred valley called Tuwa.

Allah had chosen Musa. This was not an ordinary journey anymore. Musa was being prepared for a great mission.

Allah told Musa to worship Him and establish prayer for His remembrance. Musa was going to return to Egypt, not as someone running away, but as a Prophet carrying Allah's message.

The fire had led Musa to something far greater than warmth. It led him to revelation, guidance, and the beginning of his mission.$body$,
   'Taha', 10,
   $tr$Musa saw a fire, approached it, and Allah called him in the sacred valley (20:10 to 20:14).$tr$,
   $sm$Allah spoke to Musa and chose him as a Prophet.$sm$,
   ARRAY[
     $i$Allah guides whom He wills.$i$,
     $i$Prayer helps us remember Allah.$i$,
     $i$Prophets are chosen by Allah.$i$,
     $i$A small moment can become life changing by Allah's plan.$i$
   ],
   $rq$Why is it special that Allah chose Musa as a Prophet?$rq$,
   100, true),

-- ─── Chapter 6 ──────────────────────────────────────────────────────────────
  (6, 'the-staff-and-the-mission', 6, 'The Staff and the Mission',
   $sub$Allah gives Musa signs and appoints Harun to help him.$sub$,
   $body$Allah asked Musa what was in his right hand. Musa said it was his staff. He used it to lean on, to care for his animals, and for other useful things.

Then Allah told Musa to throw it down. Musa obeyed, and the staff became a moving snake. Musa felt afraid, but Allah told him not to fear. Allah told him to take it, and it returned to being a staff again.

Allah also gave Musa another sign involving his hand. These signs were miracles from Allah, not magic tricks. They showed that Allah's power is greater than anything people can invent.

Musa knew the mission ahead was difficult. He asked Allah to make his task easy, to give him strength, and to appoint his brother Harun as a helper. Allah accepted his request.

Musa was not being sent alone. Allah gave him signs, courage, and support.$body$,
   'Taha', 17,
   $tr$Allah showed Musa the miracle of the staff and accepted his dua for Harun to help him (20:17 to 20:23 and 20:25 to 20:35).$tr$,
   $sm$Allah gave Musa miracles and allowed his brother Harun to support him.$sm$,
   ARRAY[
     $i$Allah's power is greater than anything.$i$,
     $i$Miracles come from Allah, not from magic.$i$,
     $i$It is good to ask Allah for help.$i$,
     $i$Teamwork can make a difficult mission easier.$i$
   ],
   $rq$Who helps you when you are trying to do something good?$rq$,
   100, true),

-- ─── Chapter 7 ──────────────────────────────────────────────────────────────
  (7, 'confronting-pharaoh', 7, 'Confronting Pharaoh',
   $sub$Musa and Harun speak truth with courage and gentleness.$sub$,
   $body$Allah sent Musa and Harun back to Pharaoh. This was not easy. Pharaoh was powerful, proud, and cruel. He had hurt people and believed he could do whatever he wanted.

But Allah gave Musa and Harun an important instruction. They were to speak to Pharaoh gently. Even when speaking to someone harsh and unfair, they were told to use calm and careful words.

Musa and Harun told Pharaoh to worship Allah and let Bani Isra'il go. Pharaoh refused. He questioned Musa, argued against him, and tried to make himself seem powerful.

But Musa knew the truth. Pharaoh had a throne, an army, and wealth, but Musa had Allah's message. Real strength is not always loud. Sometimes real strength is staying truthful, patient, and well-mannered.

Musa faced Pharaoh with courage, but he did not forget adab. He showed us that truth and good character should stay together.$body$,
   'Taha', 43,
   $tr$Allah told Musa and Harun to go to Pharaoh and speak to him gently (20:43 to 20:44).$tr$,
   $sm$Allah told Musa and Harun to speak with gentleness, even to Pharaoh.$sm$,
   ARRAY[
     $i$Muslims should speak with good manners.$i$,
     $i$Courage does not have to be rude.$i$,
     $i$Truth is strongest when carried with patience.$i$,
     $i$Power without obedience to Allah is not real success.$i$
   ],
   $rq$Why do you think Allah told Musa and Harun to speak gently?$rq$,
   100, true),

-- ─── Chapter 8 ──────────────────────────────────────────────────────────────
  (8, 'the-magicians-believe', 8, 'The Magicians Believe',
   $sub$Pharaoh's magicians see the truth and choose faith.$sub$,
   $body$Pharaoh wanted to challenge Musa in front of the people. He gathered skilled magicians and promised them rewards if they defeated Musa.

The magicians threw their ropes and staffs. Through magic, it looked as if the ropes were moving. The crowd watched closely, and Musa felt fear inside himself.

Allah reassured Musa. Musa threw down his staff, and by Allah's power it swallowed what the magicians had made appear. The magicians immediately realised something important. This was not magic. This was a miracle from Allah.

The magicians fell down in prostration and declared their belief in the Lord of Musa and Harun. Pharaoh became angry and threatened them, but their hearts had changed.

They had started the day wanting reward from Pharaoh. They ended it believing in Allah. When the truth became clear, they chose faith over fear.$body$,
   'Taha', 65,
   $tr$The magicians challenged Musa, saw Allah's miracle, and believed in the Lord of Musa and Harun (20:65 to 20:70).$tr$,
   $sm$The magicians realised Musa's miracle was from Allah, so they believed.$sm$,
   ARRAY[
     $i$Truth is stronger than falsehood.$i$,
     $i$A sincere heart can change quickly.$i$,
     $i$Believing in Allah is more valuable than rewards from people.$i$,
     $i$We should follow the truth when we recognise it.$i$
   ],
   $rq$What made the magicians realise that Musa was telling the truth?$rq$,
   100, true),

-- ─── Chapter 9 ──────────────────────────────────────────────────────────────
  (9, 'the-signs-upon-egypt', 9, 'The Signs Upon Egypt',
   $sub$Allah sends signs, but Pharaoh keeps refusing.$sub$,
   $body$Pharaoh and his people kept rejecting Musa's message. They saw signs from Allah, but their hearts remained proud.

Allah tested the people of Pharaoh with difficult years, shortage of crops, and other signs. These signs were warnings. They were chances to stop, think, and turn back to Allah.

But when good things happened, Pharaoh's people acted as if they deserved them. When hardship came, they blamed Musa and the believers. They did not want to admit that their own wrongdoing was the problem.

Musa continued to call them to Allah. The signs were not random. They were reminders that Allah is in control, and that no ruler, army, or kingdom can escape Him.

The story teaches us that signs only help when a person is willing to listen. A proud heart can see many warnings and still refuse to change.$body$,
   'Al-A''raf', 130,
   $tr$Allah tested Pharaoh's people with hardship and signs, but they continued rejecting the truth (7:130 to 7:136).$tr$,
   $sm$Allah sent warnings to Pharaoh's people, but they refused to listen.$sm$,
   ARRAY[
     $i$Hardship can be a reminder to return to Allah.$i$,
     $i$Pride stops people from accepting the truth.$i$,
     $i$Blaming others does not fix our own mistakes.$i$,
     $i$Allah gives people chances to change.$i$
   ],
   $rq$Why is it important to listen when Allah sends reminders?$rq$,
   100, true),

-- ─── Chapter 10 ─────────────────────────────────────────────────────────────
  (10, 'the-sea-opens', 10, 'The Sea Opens',
   $sub$When Musa's people feel trapped, Allah makes a way.$sub$,
   $body$Musa and the believers left Egypt, but Pharaoh and his army chased after them. Soon, the believers reached the sea. In front of them was water. Behind them was Pharaoh's army.

Some people became frightened. It looked like there was no escape. But Musa did not lose trust in Allah. He knew that Allah was with him and would guide him.

Allah told Musa to strike the sea with his staff. Musa obeyed, and by Allah's power the sea split open. The water rose like great walls, and a dry path appeared through the middle.

Musa and the believers crossed safely. Pharaoh and his army followed in arrogance, but they were not saved.

What looked impossible became possible because Allah commanded it. The sea, the path, the rescue, and the victory all belonged to Allah.$body$,
   'Ash-Shu''ara', 61,
   $tr$When Musa's people feared they would be overtaken, Musa trusted Allah, and Allah commanded him to strike the sea with his staff (26:61 to 26:63).$tr$,
   $sm$Allah opened a safe path through the sea for Musa and the believers.$sm$,
   ARRAY[
     $i$Allah can make a way when we see no way.$i$,
     $i$Never lose hope in Allah.$i$,
     $i$Obedience to Allah brings safety.$i$,
     $i$Arrogance leads to destruction.$i$
   ],
   $rq$What should you remember when a problem feels impossible?$rq$,
   100, true),

-- ─── Chapter 11 ─────────────────────────────────────────────────────────────
  (11, 'the-tablets-of-guidance', 11, 'The Tablets of Guidance',
   $sub$Allah gives Musa guidance for his people.$sub$,
   $body$After Allah saved Musa and the believers, Musa continued to teach and guide his people. They were free from Pharaoh, but they still needed to learn how to live in obedience to Allah.

Allah gave Musa tablets containing guidance and instruction. This guidance taught the people what was right, what was wrong, and how to live with responsibility.

Guidance is a mercy from Allah. Without guidance, people can become confused, forgetful, or ungrateful. With guidance, people can make better choices and remember their purpose.

Musa was told to hold firmly to what Allah had given him and to teach his people to follow the best of it. This reminds us that learning is not only about knowing facts. It is about living in a way that pleases Allah.

Allah's guidance is not heavy to hurt us. It is light to help us walk the right path.$body$,
   'Al-A''raf', 145,
   $tr$Allah gave Musa tablets with instruction and explanation, and told him to hold firmly to them.$tr$,
   $sm$Allah gave Musa guidance to teach his people how to live rightly.$sm$,
   ARRAY[
     $i$Allah teaches people what is good.$i$,
     $i$Guidance helps us make better choices.$i$,
     $i$Knowledge should lead to action.$i$,
     $i$We should hold firmly to what Allah teaches.$i$
   ],
   $rq$How can guidance from Allah help you in daily life?$rq$,
   100, true),

-- ─── Chapter 12 ─────────────────────────────────────────────────────────────
  (12, 'the-wilderness-lessons', 12, 'The Wilderness Lessons',
   $sub$Allah provides for His people, but they must learn gratitude and patience.$sub$,
   $body$After leaving Egypt, Bani Isra'il spent time in the wilderness. They were no longer under Pharaoh's rule, but freedom came with lessons.

Allah gave them shade from clouds and provided food for them. He cared for them even in a dry and difficult place. But some people still complained, forgot Allah's favours, or failed to show gratitude.

Musa had to keep reminding his people. Being saved from danger was not the end of the journey. They still needed faith, patience, obedience, and thankfulness.

This part of Musa's story teaches us something very important. Allah may give us blessings, but we must learn how to receive them with grateful hearts. We should not only ask Allah for help when we are in trouble. We should also remember Him when we are safe.

The wilderness was not just an empty land. It was a place of learning. Allah was teaching His people to rely on Him, obey Him, and be thankful.$body$,
   'Al-Baqarah', 57,
   $tr$Allah shaded Bani Isra'il with clouds and provided them with good food.$tr$,
   $sm$Allah cared for Musa's people in the wilderness and taught them gratitude.$sm$,
   ARRAY[
     $i$Allah provides in many ways.$i$,
     $i$Freedom still needs responsibility.$i$,
     $i$Gratitude protects the heart.$i$,
     $i$We should remember Allah in ease and hardship.$i$
   ],
   $rq$What is one blessing from Allah that you can be thankful for today?$rq$,
   100, true)

ON CONFLICT (id) DO UPDATE SET
  slug                = EXCLUDED.slug,
  number              = EXCLUDED.number,
  title               = EXCLUDED.title,
  subtitle            = EXCLUDED.subtitle,
  body_md             = EXCLUDED.body_md,
  surah               = EXCLUDED.surah,
  verse_number        = EXCLUDED.verse_number,
  arabic_translation  = EXCLUDED.arabic_translation,
  simple_meaning      = EXCLUDED.simple_meaning,
  key_insights        = EXCLUDED.key_insights,
  reflection_question = EXCLUDED.reflection_question,
  xp_reward           = EXCLUDED.xp_reward,
  is_published        = EXCLUDED.is_published;
