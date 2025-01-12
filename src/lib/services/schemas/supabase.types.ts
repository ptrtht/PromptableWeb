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
      api_keys: {
        Row: {
          created_at: string
          id: number
          key: string
          name: string | null
          status: Database["public"]["Enums"]["api_key_status_enum"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          key?: string
          name?: string | null
          status?: Database["public"]["Enums"]["api_key_status_enum"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          key?: string
          name?: string | null
          status?: Database["public"]["Enums"]["api_key_status_enum"]
          user_id?: string
        }
        Relationships: []
      }
      pipeline_runs: {
        Row: {
          created_at: string
          id: number
          input: Json | null
          log: Json
          pipeline_id: string
          price: number
          result: Database["public"]["Enums"]["pipeline_result"]
          version: number
        }
        Insert: {
          created_at?: string
          id?: number
          input?: Json | null
          log: Json
          pipeline_id: string
          price: number
          result: Database["public"]["Enums"]["pipeline_result"]
          version: number
        }
        Update: {
          created_at?: string
          id?: number
          input?: Json | null
          log?: Json
          pipeline_id?: string
          price?: number
          result?: Database["public"]["Enums"]["pipeline_result"]
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_runs_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_runs_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_stats_total"
            referencedColumns: ["id"]
          },
        ]
      }
      pipelines: {
        Row: {
          created_at: string
          id: string
          modified_at: string
          name: string
          pipeline: Json
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          modified_at?: string
          name?: string
          pipeline: Json
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          id?: string
          modified_at?: string
          name?: string
          pipeline?: Json
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      prompt_logs: {
        Row: {
          created_at: string
          id: number
          input: Json | null
          output: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          input?: Json | null
          output?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          input?: Json | null
          output?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          created_at: string
          description: string
          id: number
          link: string
          logo_url: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          link: string
          logo_url: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          link?: string
          logo_url?: string
          name?: string
        }
        Relationships: []
      }
      virtual_keys: {
        Row: {
          created_at: string
          id: string
          key: string
          name: string
          provider: string
          status: Database["public"]["Enums"]["api_key_status_enum"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          name: string
          provider: string
          status?: Database["public"]["Enums"]["api_key_status_enum"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          name?: string
          provider?: string
          status?: Database["public"]["Enums"]["api_key_status_enum"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_orphaned_virtual_keys: {
        Row: {
          created_at: string | null
          id: string | null
          key: string | null
          name: string | null
          provider: string | null
          status: Database["public"]["Enums"]["api_key_status_enum"] | null
          user_id: string | null
        }
        Relationships: []
      }
      v_pipeline_stats_total: {
        Row: {
          created_at: string | null
          error_rate: number | null
          id: string | null
          modified_at: string | null
          name: string | null
          price_per_run: number | null
          status: string | null
          total_runs: number | null
          user_id: string | null
          version: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      api_key_status_enum: "active" | "revoked" | "deleted"
      pipeline_result: "Success" | "Fail" | "Warn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
