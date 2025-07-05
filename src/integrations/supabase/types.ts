export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          created_at: string | null
          description_en: string
          description_uz: string
          icon_url: string | null
          id: string
          name_en: string
          name_uz: string
        }
        Insert: {
          created_at?: string | null
          description_en: string
          description_uz: string
          icon_url?: string | null
          id: string
          name_en: string
          name_uz: string
        }
        Update: {
          created_at?: string | null
          description_en?: string
          description_uz?: string
          icon_url?: string | null
          id?: string
          name_en?: string
          name_uz?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          category: string | null
          created_at: string
          description: string
          end_date: string
          goal_count: number
          id: string
          start_date: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          end_date: string
          goal_count: number
          id?: string
          start_date: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          end_date?: string
          goal_count?: number
          id?: string
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "educational_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "educational_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "educational_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "educational_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_posts: {
        Row: {
          category: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          language: string | null
          likes_count: number | null
          post_type: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          language?: string | null
          likes_count?: number | null
          post_type: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          language?: string | null
          likes_count?: number | null
          post_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      leaderboard_stats: {
        Row: {
          date: string
          id: string
          species_count: number | null
          total_likes: number | null
          user_id: string
        }
        Insert: {
          date?: string
          id?: string
          species_count?: number | null
          total_likes?: number | null
          user_id: string
        }
        Update: {
          date?: string
          id?: string
          species_count?: number | null
          total_likes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          from_user_id: string | null
          id: string
          is_read: boolean
          message: string
          post_id: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean
          message: string
          post_id?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          from_user_id?: string | null
          id?: string
          is_read?: boolean
          message?: string
          post_id?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          behavior: string | null
          caption: string | null
          category: string | null
          confidence: string | null
          conservation_status: string | null
          created_at: string
          description: string | null
          diet: string | null
          habitat: string | null
          id: string
          identification_notes: string | null
          image_url: string
          interesting_facts: string | null
          is_private: boolean
          latitude: number
          location_name: string | null
          longitude: number
          scientific_name: string | null
          species_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          behavior?: string | null
          caption?: string | null
          category?: string | null
          confidence?: string | null
          conservation_status?: string | null
          created_at?: string
          description?: string | null
          diet?: string | null
          habitat?: string | null
          id?: string
          identification_notes?: string | null
          image_url: string
          interesting_facts?: string | null
          is_private?: boolean
          latitude: number
          location_name?: string | null
          longitude: number
          scientific_name?: string | null
          species_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          behavior?: string | null
          caption?: string | null
          category?: string | null
          confidence?: string | null
          conservation_status?: string | null
          created_at?: string
          description?: string | null
          diet?: string | null
          habitat?: string | null
          id?: string
          identification_notes?: string | null
          image_url?: string
          interesting_facts?: string | null
          is_private?: boolean
          latitude?: number
          location_name?: string | null
          longitude?: number
          scientific_name?: string | null
          species_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          first_name: string | null
          id: string
          language_preference: string | null
          last_name: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          language_preference?: string | null
          last_name?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          language_preference?: string | null
          last_name?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      saved_posts: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      species: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          scientific_name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          scientific_name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          scientific_name?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed: boolean
          created_at: string
          id: string
          progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean
          created_at?: string
          id?: string
          progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean
          created_at?: string
          id?: string
          progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_history: {
        Row: {
          action_type: string
          category: string | null
          created_at: string
          description: string | null
          educational_post_id: string | null
          id: string
          image_url: string | null
          post_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          action_type: string
          category?: string | null
          created_at?: string
          description?: string | null
          educational_post_id?: string | null
          id?: string
          image_url?: string | null
          post_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          action_type?: string
          category?: string | null
          created_at?: string
          description?: string | null
          educational_post_id?: string | null
          id?: string
          image_url?: string | null
          post_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_title: string
          p_message: string
          p_post_id?: string
          p_from_user_id?: string
        }
        Returns: string
      }
      get_follower_count: {
        Args: { user_id: string }
        Returns: number
      }
      get_following_count: {
        Args: { user_id: string }
        Returns: number
      }
      get_leaderboard: {
        Args: { period_type: string }
        Returns: {
          user_id: string
          username: string
          first_name: string
          last_name: string
          avatar_url: string
          species_count: number
          rank: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
