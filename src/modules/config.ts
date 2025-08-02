import { z } from "zod";

// 環境変数のスキーマ定義（シンプル版）
const envSchema = z.object({
  // Node.js環境設定
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  
  // Slack設定（必須）
  SLACK_BOT_TOKEN: z.string().min(1, "SLACK_BOT_TOKEN is required"),
  SLACK_SIGNING_SECRET: z.string().min(1, "SLACK_SIGNING_SECRET is required"),
  
  // チャンネルID（本番では必須、開発ではオプション）
  GENERAL_CHANNEL_ID: z.string().optional(),
  WEATHER_CHANNEL_ID: z.string().optional(),
  
  // 外部API設定
  NATURE_REMO_TOKEN: z.string().optional(),
  
  // 地域・時間設定
  FORECAST_AREA_ID: z.string().default("13101"),
  TIMEZONE: z.string().default("Asia/Tokyo"),
  UTC_OFFSET: z.coerce.number().int().default(9),
});

// 本番環境用の厳格なスキーマ
const productionEnvSchema = envSchema.extend({
  GENERAL_CHANNEL_ID: z.string().min(1, "GENERAL_CHANNEL_ID is required in production"),
  WEATHER_CHANNEL_ID: z.string().min(1, "WEATHER_CHANNEL_ID is required in production"),
  NATURE_REMO_TOKEN: z.string().min(1, "NATURE_REMO_TOKEN is required in production"),
});

// 環境変数の検証と取得
const validateEnvironment = () => {
  const isProduction = process.env.NODE_ENV === "production";
  const schema = isProduction ? productionEnvSchema : envSchema;
  
  try {
    return schema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((err) => 
        `- ${err.path.join(".")}: ${err.message}`
      );
      throw new Error(`Environment validation failed:\n${errorMessages.join("\n")}`);
    }
    throw error;
  }
};

// 検証済み環境変数
const env = validateEnvironment();

interface Config {
  app: {
    port: number;
    nodeEnv: string;
    isProduction: boolean;
  };
  weather: {
    defaultAreaId: string;
    notificationHour: number;
    zutoolApiEndpoint: string;
    forecast: {
      pressureLevelThreshold: number;
      hourInterval: number;
    };
  };
  slack: {
    botToken: string;
    signingSecret: string;
    generalChannelId: string;
    weatherChannelId: string;
  };
  notification: {
    timezone: string;
    utcOffset: number;
  };
  remo: {
    apiEndpoint: string;
    token: string;
    status: {
      hourInterval: number;
    };
    thresholds: {
      temperature: {
        max: number;
        min: number;
      };
      humidity: {
        max: number;
        min: number;
      };
    };
  };
}

export const config: Config = {
  app: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === "production",
  },
  weather: {
    defaultAreaId: env.FORECAST_AREA_ID,
    notificationHour: 6,
    zutoolApiEndpoint: "https://zutool.jp/api/getweatherstatus",
    forecast: {
      pressureLevelThreshold: 2,
      hourInterval: 3,
    },
  },
  slack: {
    botToken: env.SLACK_BOT_TOKEN,
    signingSecret: env.SLACK_SIGNING_SECRET,
    generalChannelId: env.GENERAL_CHANNEL_ID ?? "",
    weatherChannelId: env.WEATHER_CHANNEL_ID ?? "",
  },
  notification: {
    timezone: env.TIMEZONE,
    utcOffset: env.UTC_OFFSET,
  },
  remo: {
    apiEndpoint: "https://api.nature.global/1/devices",
    token: env.NATURE_REMO_TOKEN ?? "",
    status: {
      hourInterval: 4,
    },
    thresholds: {
      temperature: {
        max: 28,
        min: 17,
      },
      humidity: {
        max: 70,
        min: 40,
      },
    },
  },
};
