package config

import (
	"errors"
	"log"
	"time"

	"github.com/spf13/viper"
)

// Config app config struct
type Config struct {
	Postgres     PostgresConfig
	Redis        RedisConfig
	AWS          AWS
	Server       ServerConfig
	Logger       Logger
	JWT          JWT
	GRPCServices GRPCServices
}

// ServerConfig server config
type ServerConfig struct {
	AppVersion  string
	Host        string
	Port        string
	Mode        string
	ReadTimeout time.Duration
}

type GRPCServices struct {
	WidgetsHost string
	WidgetsPort string
}

// JWT json web tokens config
type JWT struct {
	SecretKey        string
	RefreshKey       string
	SecretKeyExpire  time.Duration
	RefreshKeyExpire time.Duration
}

// Logger config
type Logger struct {
	Encoding          string
	Level             string
	Development       bool
	DisableCaller     bool
	DisableStacktrace bool
}

// PostgresConfig postgresql config
type PostgresConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

type AWS struct {
	Endpoint       string
	MinioAccessKey string
	MinioSecretKey string
	MinioEndpoint  string
	UseSSL         bool
}

type RedisConfig struct {
	RedisAddr      string
	RedisPassword  string
	RedisDB        string
	RedisDefaultdb string
	MinIdleConns   int
	PoolSize       int
	PoolTimeout    int
	Password       string
	DB             int
}

// LoadConfig load config file from given path
func LoadConfig(filename string) (*viper.Viper, error) {
	v := viper.New()

	v.SetConfigName(filename)
	v.AddConfigPath(".")
	v.AutomaticEnv()
	if err := v.ReadInConfig(); err != nil {
		if errors.As(err, &viper.ConfigFileNotFoundError{}) {
			return nil, errors.New("config file not found")
		}
		return nil, err
	}

	return v, nil
}

// ParseConfig parse config file
func ParseConfig(v *viper.Viper) (*Config, error) {
	var c Config

	if err := v.Unmarshal(&c); err != nil {
		log.Printf("unable to decode into struct, %v", err)
		return nil, err
	}

	return &c, nil
}
