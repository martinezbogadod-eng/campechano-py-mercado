export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      featured_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          duration_days: number
          id: string
          listing_id: string
          receipt_url: string | null
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          duration_days: number
          id?: string
          listing_id: string
          receipt_url?: string | null
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          duration_days?: number
          id?: string
          listing_id?: string
          receipt_url?: string | null
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          listing_id: string
          reason: string
          reporter_id: string
          reviewed_at: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          listing_id: string
          reason: string
          reporter_id: string
          reviewed_at?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          reason?: string
          reporter_id?: string
          reviewed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          allow_whatsapp_contact: boolean
          category: Database["public"]["Enums"]["listing_category"]
          city: string
          created_at: string
          currency: string
          department: string
          description: string
          featured: boolean
          featured_until: string | null
          id: string
          images: string[] | null
          is_wholesale: boolean
          lat: number | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          lon: number | null
          min_volume: string | null
          phone_whatsapp: string
          price: number | null
          price_unit: string | null
          production_capacity: string | null
          quantity: number | null
          quantity_unit: string | null
          show_whatsapp_public: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_whatsapp_contact?: boolean
          category: Database["public"]["Enums"]["listing_category"]
          city: string
          created_at?: string
          currency?: string
          department: string
          description: string
          featured?: boolean
          featured_until?: string | null
          id?: string
          images?: string[] | null
          is_wholesale?: boolean
          lat?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          lon?: number | null
          min_volume?: string | null
          phone_whatsapp: string
          price?: number | null
          price_unit?: string | null
          production_capacity?: string | null
          quantity?: number | null
          quantity_unit?: string | null
          show_whatsapp_public?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_whatsapp_contact?: boolean
          category?: Database["public"]["Enums"]["listing_category"]
          city?: string
          created_at?: string
          currency?: string
          department?: string
          description?: string
          featured?: boolean
          featured_until?: string | null
          id?: string
          images?: string[] | null
          is_wholesale?: boolean
          lat?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          lon?: number | null
          min_volume?: string | null
          phone_whatsapp?: string
          price?: number | null
          price_unit?: string | null
          production_capacity?: string | null
          quantity?: number | null
          quantity_unit?: string | null
          show_whatsapp_public?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          listing_id: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          listing_id: string
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          listing_id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          department: string | null
          description: string | null
          id: string
          name: string | null
          phone_whatsapp: string | null
          preferred_language: string | null
          profile_type: Database["public"]["Enums"]["profile_type"] | null
          suspended: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          id: string
          name?: string | null
          phone_whatsapp?: string | null
          preferred_language?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type"] | null
          suspended?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          name?: string | null
          phone_whatsapp?: string | null
          preferred_language?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type"] | null
          suspended?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewed_id: string
          reviewer_id: string
          transaction_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewed_id: string
          reviewer_id: string
          transaction_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewed_id?: string
          reviewer_id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      role_change_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          from_role: string
          id: string
          reason: string
          reviewed_at: string | null
          status: string
          to_role: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          from_role: string
          id?: string
          reason: string
          reviewed_at?: string | null
          status?: string
          to_role: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          from_role?: string
          id?: string
          reason?: string
          reviewed_at?: string | null
          status?: string
          to_role?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          admin_validated: boolean | null
          buyer_confirmed: boolean | null
          buyer_id: string
          completed_at: string | null
          created_at: string
          id: string
          listing_id: string | null
          notes: string | null
          seller_confirmed: boolean | null
          seller_id: string
          status: string
        }
        Insert: {
          admin_validated?: boolean | null
          buyer_confirmed?: boolean | null
          buyer_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          seller_confirmed?: boolean | null
          seller_id: string
          status?: string
        }
        Update: {
          admin_validated?: boolean | null
          buyer_confirmed?: boolean | null
          buyer_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          notes?: string | null
          seller_confirmed?: boolean | null
          seller_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_capabilities: {
        Row: {
          admin_notes: string | null
          capability: string
          id: string
          requested_at: string
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          capability: string
          id?: string
          requested_at?: string
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          capability?: string
          id?: string
          requested_at?: string
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "consumidor"
        | "productor"
        | "prestador"
        | "admin"
        | "productor_minorista"
        | "productor_mayorista"
      listing_category:
        | "granos"
        | "frutas-verduras"
        | "ganaderia"
        | "maquinaria"
        | "insumos"
        | "servicios"
        | "forestal"
        | "viveros"
      listing_type: "oferta" | "demanda" | "servicio"
      profile_type: "productor" | "tecnico" | "proveedor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "consumidor",
        "productor",
        "prestador",
        "admin",
        "productor_minorista",
        "productor_mayorista",
      ],
      listing_category: [
        "granos",
        "frutas-verduras",
        "ganaderia",
        "maquinaria",
        "insumos",
        "servicios",
        "forestal",
        "viveros",
      ],
      listing_type: ["oferta", "demanda", "servicio"],
      profile_type: ["productor", "tecnico", "proveedor"],
    },
  },
} as const
