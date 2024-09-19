// pages/api/decks/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react';
import { Deck } from '../../../models/Deck';
import dbConnect from '../../../lib/dbConnect';
import { error } from "console";

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session){
        return res.status(401).json({ error: "Unotherized"});

    }

    await dbConnect();

    switch (req.method) {
        case 'GET':
            try {
                const decks = await Deck.find({ user: session.user.id });
                res.status(200).json(decks);
            } catch (error){
                res.status(500).json({error: 'Error fetching decks'});
            }

            break;
        
        case 'POST':
            try{
                const deck = await Deck.create({
                    ...req.body,
                    user: session.user.id,
                });
                res.status(201).json(deck);
            } catch (error){
                res.status(500).json({error:'Error creating deck'});
            }

            break;
        default:
            res.setHeader('Allow',['GET','POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);


    }
    
}