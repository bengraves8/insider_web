import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// GET /api/contacts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const contactsRef = collection(db, 'contacts');
    const q = query(contactsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const contacts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// POST /api/contacts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...contactData } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const contactsRef = collection(db, 'contacts');
    const docRef = await addDoc(contactsRef, {
      ...contactData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const newContact = await getDoc(docRef);
    
    return NextResponse.json({
      id: docRef.id,
      ...newContact.data()
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}

// PATCH /api/contacts
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, ...updateData } = body;

    if (!id || !userId) {
      return NextResponse.json({ error: 'Contact ID and User ID are required' }, { status: 400 });
    }

    const contactRef = doc(db, 'contacts', id);
    const contactSnap = await getDoc(contactRef);

    if (!contactSnap.exists()) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    if (contactSnap.data().userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await updateDoc(contactRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });

    const updatedContact = await getDoc(contactRef);
    
    return NextResponse.json({
      id: contactRef.id,
      ...updatedContact.data()
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

// DELETE /api/contacts
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json({ error: 'Contact ID and User ID are required' }, { status: 400 });
    }

    const contactRef = doc(db, 'contacts', id);
    const contactSnap = await getDoc(contactRef);

    if (!contactSnap.exists()) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    if (contactSnap.data().userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await deleteDoc(contactRef);
    
    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}