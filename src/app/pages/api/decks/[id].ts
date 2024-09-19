import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Deck } from '../../../models/Decks';
import dbConnect from '../../../lib/dbConnect';
import { error } from 'console';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json({ error: 'Unauthorized'});
    }

    const {id} = req.query;
    await dbConnect();

    switch (req.method){
        case 'GET':
            try {
                const deck = await Deck.findOne({ _id: id, user: session.user.id });
                if (!deck) {
                  return res.status(404).json({ error: 'Deck not found' });
                }
                res.status(200).json(deck);
              } catch (error) {
                res.status(500).json({ error: 'Error fetching deck' });
              }

              break;

        case 'PUT':
            try {
                const deck = await Deck.findOneAndUpdate(
                    {_id: id, user: session.user.id},
                    req.body,
                    { new: true, runValidators: true }
                );
                if(!deck){
                    return res.status(404).json({ error: 'Deck not found' });
                }
                res.status(200).json(deck);
            } catch (error) {
                res.status(200).json({ error: 'Error updating deck'});
            }
            break;

        case 'DELETE':
            try {
                const deck = await Deck.findOneAndDelete({_id: id, user: session.user.id});
                if (!deck) {
                    return res.status(404).json({ error: 'Deck not found'});
                }
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: 'Error deleting deck'});
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}