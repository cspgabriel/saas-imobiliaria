import { db, auth, handleFirestoreError, OperationType } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  Timestamp,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

export interface Agency {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  plan: string;
  ownerId: string;
}

export const slugify = (input: string): string => {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
};

export const isSlugAvailable = async (slug: string): Promise<boolean> => {
  const q = query(collection(db, "agencies"), where("subdomain", "==", slug));
  const snap = await getDocs(q);
  return snap.empty;
};

export const generateUniqueSlug = async (name: string): Promise<string> => {
  const base = slugify(name) || "imobiliaria";
  if (await isSlugAvailable(base)) return base;
  for (let i = 2; i <= 99; i++) {
    const candidate = `${base}-${i}`;
    if (await isSlugAvailable(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
};

export const createAgency = async (params: {
  name: string;
  slug: string;
  ownerId: string;
  plan?: string;
}): Promise<Agency> => {
  const { name, slug, ownerId, plan = "trial" } = params;
  const ref = await addDoc(collection(db, "agencies"), {
    name,
    subdomain: slug,
    plan,
    ownerId,
    createdAt: Timestamp.now(),
  });
  return { id: ref.id, name, subdomain: slug, plan, ownerId };
};

export const getAgencyById = async (id: string): Promise<Agency | null> => {
  try {
    const snap = await getDoc(doc(db, "agencies", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Agency;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `agencies/${id}`);
    return null;
  }
};

export const getAgencyBySlug = async (slug: string): Promise<Agency | null> => {
  try {
    const q = query(collection(db, "agencies"), where("subdomain", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Agency;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, "agencies");
    return null;
  }
};

export const bindUserToAgency = async (userId: string, agencyId: string): Promise<void> => {
  await updateDoc(doc(db, "users", userId), { agencyId });
};

export const getAgencyByHost = async (
  hostname: string,
): Promise<Agency | null> => {
  try {
    const agRef = collection(db, "agencies");

    // Check if it matches a custom domain first
    const qCustom = query(agRef, where("customDomain", "==", hostname));
    const snapCustom = await getDocs(qCustom);
    if (!snapCustom.empty) {
      return {
        id: snapCustom.docs[0].id,
        ...snapCustom.docs[0].data(),
      } as Agency;
    }

    // Then check by subdomain (e.g., 'imobiliaria-xyz.meusaas.com')
    // We try to extract the first part of the hostname
    const subdomain = hostname.split(".")[0];
    const qSub = query(agRef, where("subdomain", "==", subdomain));
    const snapSub = await getDocs(qSub);
    if (!snapSub.empty) {
      return { id: snapSub.docs[0].id, ...snapSub.docs[0].data() } as Agency;
    }

    // In dev environment or if matched nothing, default to "demo" agency
    if (hostname === "localhost" || hostname.includes("run.app") || hostname.includes("github.io")) {
      const demoDoc = await getDoc(doc(db, "agencies", "demo"));
      
      const rjProperties = [
        {
          title: "Cobertura Triplex de Luxo com Vista-Mar",
          description:
            "Incrível cobertura triplex no coração da orla, com piscina privativa, automação completa e acabamento em mármore importado.",
          price: 15500000,
          type: "VENDA",
          status: "DISPONIVEL",
          city: "Rio de Janeiro",
          neighborhood: "Leblon",
          bedrooms: 5,
          bathrooms: 6,
          area: 650,
          imageUrl:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Apartamento Frontal Praia",
          description:
            "Amplo apartamento de 4 suítes, varanda gourmet fechada com cortina de vidro e vista deslumbrante para o mar e morro dois irmãos.",
          price: 8900000,
          type: "VENDA",
          status: "DISPONIVEL",
          city: "Rio de Janeiro",
          neighborhood: "Ipanema",
          bedrooms: 4,
          bathrooms: 5,
          area: 320,
          imageUrl:
            "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Casa Contemporânea em Condomínio",
          description:
            "Casa de alto padrão projeto de arquiteto renomado. Área de lazer incrível com sauna integrada à piscina e área gourmet.",
          price: 6200000,
          type: "VENDA",
          status: "DISPONIVEL",
          city: "Rio de Janeiro",
          neighborhood: "Barra da Tijuca",
          bedrooms: 4,
          bathrooms: 6,
          area: 550,
          imageUrl:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Flat Mobiliado Posto 4",
          description:
            "Flat finamente decorado, pronto para morar ou locação temporária. Próximo ao metrô e a duas quadras da praia.",
          price: 6500,
          type: "LOCACAO",
          status: "DISPONIVEL",
          city: "Rio de Janeiro",
          neighborhood: "Copacabana",
          bedrooms: 1,
          bathrooms: 1,
          area: 55,
          imageUrl:
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Apartamento Garden com Quintal",
          description:
            "Exclusivo apartamento tipo garden, com amplo quintal em 'U' abraçando o imóvel. Condomínio com infraestrutura tipo clube infantil.",
          price: 1850000,
          type: "VENDA",
          status: "DISPONIVEL",
          city: "Rio de Janeiro",
          neighborhood: "Recreio dos Bandeirantes",
          bedrooms: 3,
          bathrooms: 3,
          area: 180,
          imageUrl:
            "https://images.unsplash.com/photo-1600607687920-4e2a09c15468?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Mansão Suspensa Península",
          description:
            "Apartamento gigantesco com vista pra lagoa da Península. Acabamento primoroso. Segurança armada 24h.",
          price: 35000,
          type: "LOCACAO",
          status: "DISPONIVEL",
          city: "Rio de Janeiro",
          neighborhood: "Barra da Tijuca",
          bedrooms: 4,
          bathrooms: 5,
          area: 420,
          imageUrl:
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80",
        },
      ];

      if (demoDoc.exists()) {
        // Fallback: check if properties exist, if not seed it.
        const propsSnap = await getDocs(query(collection(db, "agencies", "demo", "properties")));
        if (propsSnap.empty) {
          for (const p of rjProperties) {
            await setDoc(doc(collection(db, "agencies", "demo", "properties")), {
              ...p,
              views: Math.floor(Math.random() * 500),
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });
          }
        }
        return { id: "demo", ...demoDoc.data() } as Agency;
      } else {
        // Bootstrap demo agency
        const fakeOwnerId = "demo-owner-id";
        await setDoc(doc(db, "agencies", "demo"), {
          name: "RJ Imóveis Prime S.A.",
          subdomain: "demo",
          plan: "enterprise",
          ownerId: fakeOwnerId,
          createdAt: Timestamp.now(),
        });

        // Bootstrap seeded properties for RJ
        for (const p of rjProperties) {
          await setDoc(doc(collection(db, "agencies", "demo", "properties")), {
            ...p,
            views: Math.floor(Math.random() * 500),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }

        return {
          id: "demo",
          name: "RJ Imóveis Prime S.A.",
          subdomain: "demo",
          plan: "enterprise",
          ownerId: fakeOwnerId,
        };
      }
    }

    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, "agencies");
    return null;
  }
};
