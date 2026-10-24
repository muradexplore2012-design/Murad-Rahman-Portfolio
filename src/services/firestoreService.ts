import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type {
  SiteProfile,
  Project,
  Service,
  SkillGroup,
  Testimonial,
  ContactMessage,
  SiteSettings
} from '../types';
import {
  starterProfile,
  starterProjects,
  starterServices,
  starterSkillGroups,
  starterTestimonials,
  starterSettings
} from './starterData';

// Firestore collection names
const COLLECTIONS = {
  PROFILE: 'profile',
  PROJECTS: 'projects',
  SERVICES: 'services',
  SKILLS: 'skillGroups',
  TESTIMONIALS: 'testimonials',
  CONTACT_MESSAGES: 'contactMessages',
  SETTINGS: 'siteSettings',
};

/* =========================================================================
   1. SITE PROFILE
========================================================================= */
export async function getSiteProfile(): Promise<SiteProfile> {
  if (!db) return starterProfile;
  try {
    const docRef = doc(db, COLLECTIONS.PROFILE, 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...starterProfile,
        ...data,
        socialLinks: {
          ...starterProfile.socialLinks,
          ...(data.socialLinks || {})
        }
      } as SiteProfile;
    }
  } catch (error) {
    console.warn("Could not load profile from Firestore, using starter profile:", error);
  }
  return starterProfile;
}

export async function saveSiteProfile(profileData: Partial<SiteProfile>): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, COLLECTIONS.PROFILE, 'main');
  await setDoc(docRef, { ...profileData, updatedAt: serverTimestamp() }, { merge: true });
}

/* =========================================================================
   2. PROJECTS
========================================================================= */
export async function getProjects(onlyPublished = true): Promise<Project[]> {
  if (!db) return starterProjects.filter(p => !onlyPublished || p.isPublished);
  try {
    const colRef = collection(db, COLLECTIONS.PROJECTS);
    const q = onlyPublished
      ? query(colRef, where('isPublished', '==', true))
      : colRef;

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];

      if (onlyPublished) {
        items = items.filter(p => p.isPublished !== false);
      }
      items.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
      return items;
    }
  } catch (error) {
    console.warn("Could not load projects from Firestore, falling back to starter projects:", error);
  }
  return starterProjects.filter(p => !onlyPublished || p.isPublished);
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!db) {
    return starterProjects.find(p => p.id === id) || null;
  }
  try {
    const docRef = doc(db, COLLECTIONS.PROJECTS, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Project;
    }
  } catch (error) {
    console.warn("Could not fetch project by ID:", error);
  }
  return starterProjects.find(p => p.id === id) || null;
}

export async function saveProject(project: Partial<Project> & { id?: string }): Promise<string> {
  if (!db) throw new Error("Firestore is not initialized.");
  const colRef = collection(db, COLLECTIONS.PROJECTS);

  if (project.id && !project.id.startsWith('proj-')) {
    const docRef = doc(db, COLLECTIONS.PROJECTS, project.id);
    await setDoc(docRef, { ...project, updatedAt: serverTimestamp() }, { merge: true });
    return project.id;
  } else {
    const { id: _ignored, ...data } = project;
    const newDoc = await addDoc(colRef, {
      ...data,
      isPublished: data.isPublished ?? true,
      isStarter: false,
      createdAt: serverTimestamp()
    });
    return newDoc.id;
  }
}

export async function deleteProject(id: string): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, COLLECTIONS.PROJECTS, id);
  await deleteDoc(docRef);
}

/* =========================================================================
   3. SERVICES
========================================================================= */
export async function getServices(onlyPublished = true): Promise<Service[]> {
  if (!db) return starterServices.filter(s => !onlyPublished || s.isPublished);
  try {
    const colRef = collection(db, COLLECTIONS.SERVICES);
    const q = onlyPublished
      ? query(colRef, where('isPublished', '==', true))
      : colRef;

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];

      if (onlyPublished) {
        items = items.filter(s => s.isPublished !== false);
      }
      items.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
      return items;
    }
  } catch (error) {
    console.warn("Could not load services from Firestore, using starter services:", error);
  }
  return starterServices.filter(s => !onlyPublished || s.isPublished);
}

export async function saveService(service: Partial<Service> & { id?: string }): Promise<string> {
  if (!db) throw new Error("Firestore is not initialized.");
  const colRef = collection(db, COLLECTIONS.SERVICES);

  if (service.id && !service.id.startsWith('srv-')) {
    const docRef = doc(db, COLLECTIONS.SERVICES, service.id);
    await setDoc(docRef, { ...service, updatedAt: serverTimestamp() }, { merge: true });
    return service.id;
  } else {
    const { id: _ignored, ...data } = service;
    const newDoc = await addDoc(colRef, {
      ...data,
      isPublished: data.isPublished ?? true,
      createdAt: serverTimestamp()
    });
    return newDoc.id;
  }
}

export async function deleteService(id: string): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, COLLECTIONS.SERVICES, id);
  await deleteDoc(docRef);
}

/* =========================================================================
   4. SKILLS
========================================================================= */
export async function getSkillGroups(): Promise<SkillGroup[]> {
  if (!db) return starterSkillGroups;
  try {
    const colRef = collection(db, COLLECTIONS.SKILLS);
    const querySnapshot = await getDocs(colRef);
    if (!querySnapshot.empty) {
      const items = querySnapshot.docs
        .filter(doc => {
          const data = doc.data() as any;
          return typeof data.name === 'string' && data.name.trim().length > 0 && Array.isArray(data.skills);
        })
        .map(doc => {
          const data = doc.data() as any;
          const skills = (Array.isArray(data.skills) ? data.skills : []).map((s: any) => {
            if (s.name && (s.name.toLowerCase().includes('wordpress') || s.id === 'sk-3')) {
              return { ...s, name: 'Website', icon: 'website' };
            }
            return s;
          });
          return {
            id: doc.id,
            name: data.name,
            sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 1,
            skills,
            ...data,
          };
        }) as SkillGroup[];

      if (items.length > 0) {
        return items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      }
    }
  } catch (error) {
    console.warn("Could not load skills from Firestore, using starter skills:", error);
  }
  return starterSkillGroups;
}

/**
 * Automatically cleans up any orphaned/corrupted skillGroup documents that have no valid name
 */
export async function cleanGhostSkillGroups(): Promise<number> {
  if (!db) return 0;
  try {
    const colRef = collection(db, COLLECTIONS.SKILLS);
    const snap = await getDocs(colRef);
    let deletedCount = 0;
    for (const d of snap.docs) {
      const data = d.data() as any;
      if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        await deleteDoc(doc(db, COLLECTIONS.SKILLS, d.id));
        deletedCount++;
      }
    }
    return deletedCount;
  } catch (err) {
    // If not admin, silent catch
    return 0;
  }
}

export async function saveSkillGroup(group: Partial<SkillGroup> & { id?: string }): Promise<string> {
  if (!db) throw new Error("Firestore is not initialized.");
  const colRef = collection(db, COLLECTIONS.SKILLS);

  const cleanData: any = {
    name: group.name || 'My Skills',
    sortOrder: typeof group.sortOrder === 'number' ? group.sortOrder : 1,
    skills: group.skills || [],
    updatedAt: serverTimestamp(),
  };

  if (group.id && !group.id.startsWith('sg-')) {
    const docRef = doc(db, COLLECTIONS.SKILLS, group.id);
    await setDoc(docRef, cleanData, { merge: true });
    return group.id;
  } else {
    // New group or saving starter data to Firestore
    const newDoc = await addDoc(colRef, {
      ...cleanData,
      createdAt: serverTimestamp(),
    });
    return newDoc.id;
  }
}

export async function deleteSkillGroup(id: string): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  if (id.startsWith('sg-')) {
    return;
  }
  const docRef = doc(db, COLLECTIONS.SKILLS, id);
  await deleteDoc(docRef);
}

/* =========================================================================
   5. TESTIMONIALS (Starter reviews matching Borbila, editable from Admin)
========================================================================= */
export async function getTestimonials(onlyApproved = true): Promise<Testimonial[]> {
  if (!db) return starterTestimonials;
  try {
    const colRef = collection(db, COLLECTIONS.TESTIMONIALS);

    // Query with where('isApproved', '==', true) without orderBy to prevent composite index errors
    const q = onlyApproved
      ? query(colRef, where('isApproved', '==', true))
      : colRef;

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      let items = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((item: any) => {
          const isFake =
            item.clientName === "Subhan Ansari" ||
            item.clientName === "Rabeya" ||
            item.clientName === "মোহাম্মদ আরিফ" ||
            item.id?.startsWith("testi-");
          return !isFake;
        }) as Testimonial[];

      if (onlyApproved) {
        items = items.filter(t => t.isApproved !== false);
      }

      // Sort in memory by sortOrder
      items.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));

      return items;
    }
  } catch (error) {
    console.warn("Primary testimonials query error, trying fallback:", error);
    try {
      const colRef = collection(db, COLLECTIONS.TESTIMONIALS);
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        let items = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((item: any) => {
            const isFake =
              item.clientName === "Subhan Ansari" ||
              item.clientName === "Rabeya" ||
              item.clientName === "মোহাম্মদ আরিফ" ||
              item.id?.startsWith("testi-");
            return !isFake;
          }) as Testimonial[];
        if (onlyApproved) {
          items = items.filter(t => t.isApproved !== false);
        }
        items.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
        return items;
      }
    } catch (e2) {
      console.warn("Fallback query also failed:", e2);
    }
  }
  return starterTestimonials;
}

export async function saveTestimonial(testimonial: Partial<Testimonial> & { id?: string }): Promise<string> {
  if (!db) throw new Error("Firestore is not initialized.");
  const colRef = collection(db, COLLECTIONS.TESTIMONIALS);

  if (testimonial.id) {
    const docRef = doc(db, COLLECTIONS.TESTIMONIALS, testimonial.id);
    await setDoc(docRef, { ...testimonial, updatedAt: serverTimestamp() }, { merge: true });
    return testimonial.id;
  } else {
    const { id: _ignored, ...data } = testimonial;
    const newDoc = await addDoc(colRef, {
      ...data,
      isApproved: data.isApproved ?? true,
      createdAt: serverTimestamp()
    });
    return newDoc.id;
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, COLLECTIONS.TESTIMONIALS, id);
  await deleteDoc(docRef);
}

/* =========================================================================
   6. CONTACT FORM MESSAGES (Public visitor can create; only admin can read)
========================================================================= */
export async function submitContactMessage(params: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  userId?: string;
  userPhoto?: string;
}): Promise<string> {
  if (!db) throw new Error("Database is not connected. Please try again later.");

  // Validation
  if (!params.name?.trim() || !params.email?.trim() || !params.message?.trim()) {
    throw new Error("অনুগ্রহ করে আপনার নাম, ইমেইল ও মেসেজ প্রদান করুন।");
  }

  // Basic email syntax validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(params.email.trim())) {
    throw new Error("অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস লিখুন।");
  }

  const colRef = collection(db, COLLECTIONS.CONTACT_MESSAGES);
  const docRef = await addDoc(colRef, {
    name: params.name.trim(),
    email: params.email.trim(),
    phone: params.phone?.trim() || '',
    subject: params.subject?.trim() || 'Website Inquiry',
    message: params.message.trim(),
    userId: params.userId || '',
    userPhoto: params.userPhoto || '',
    isRead: false,
    isArchived: false,
    createdAt: serverTimestamp()
  });

  return docRef.id;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!db) return [];
  try {
    const colRef = collection(db, COLLECTIONS.CONTACT_MESSAGES);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContactMessage[];
  } catch (error) {
    console.error("Error fetching contact messages (Admin access required):", error);
    throw error;
  }
}

export async function updateContactMessageStatus(id: string, updates: Partial<ContactMessage>): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, COLLECTIONS.CONTACT_MESSAGES, id);
  await updateDoc(docRef, updates);
}

export async function deleteContactMessage(id: string): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, COLLECTIONS.CONTACT_MESSAGES, id);
  await deleteDoc(docRef);
}

/* =========================================================================
   7. SITE SETTINGS
========================================================================= */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!db) return starterSettings;
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...starterSettings, ...docSnap.data() } as SiteSettings;
    }
  } catch (error) {
    console.warn("Could not load site settings from Firestore:", error);
  }
  return starterSettings;
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  if (!db) throw new Error("Firestore is not initialized.");
  const docRef = doc(db, COLLECTIONS.SETTINGS, 'main');
  await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
}

/* =========================================================================
   8. SEED STARTER CONTENT HELPER (Admin 1-click database initialization)
========================================================================= */
export async function seedStarterContentToFirestore(): Promise<{ success: boolean; message: string }> {
  if (!db) throw new Error("Firestore is not initialized.");

  try {
    // 1. Seed Profile
    const profileRef = doc(db, COLLECTIONS.PROFILE, 'main');
    await setDoc(profileRef, { ...starterProfile, updatedAt: serverTimestamp() }, { merge: true });

    // 2. Seed Settings
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'main');
    await setDoc(settingsRef, { ...starterSettings, updatedAt: serverTimestamp() }, { merge: true });

    // 3. Seed Projects
    for (const proj of starterProjects) {
      const projRef = doc(collection(db, COLLECTIONS.PROJECTS));
      const { id: _ignored, ...projData } = proj;
      await setDoc(projRef, { ...projData, createdAt: serverTimestamp() });
    }

    // 4. Seed Services
    for (const srv of starterServices) {
      const srvRef = doc(collection(db, COLLECTIONS.SERVICES));
      const { id: _ignored, ...srvData } = srv;
      await setDoc(srvRef, { ...srvData, createdAt: serverTimestamp() });
    }

    // 5. Seed Skills
    for (const group of starterSkillGroups) {
      const groupRef = doc(collection(db, COLLECTIONS.SKILLS));
      const { id: _ignored, ...groupData } = group;
      await setDoc(groupRef, { ...groupData, createdAt: serverTimestamp() });
    }

    // 6. Seed Testimonials
    for (const testi of starterTestimonials) {
      const testiRef = doc(collection(db, COLLECTIONS.TESTIMONIALS));
      const { id: _ignored, ...testiData } = testi;
      await setDoc(testiRef, { ...testiData, createdAt: serverTimestamp() });
    }

    return {
      success: true,
      message: "Starter content has been successfully seeded into your Firestore database!"
    };
  } catch (err: any) {
    console.error("Failed to seed starter content:", err);
    throw new Error(err.message || "Failed to seed content into Firestore.");
  }
}
