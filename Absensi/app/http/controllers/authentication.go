package controllers

import (
	"apk_absensi/app/models"
	"apk_absensi/app/services"

	"github.com/goravel/framework/contracts/http"
	"github.com/goravel/framework/facades"
)


func Login(ctx http.Context) http.Response {
	
	var req struct {
		Email string `json:"email"`
		Password string `json:"password"`
	}

	if err := ctx.Request().Bind(&req); err != nil {
		return ctx.Response().Json(400, http.Json{
			"error": "Invalid request",
		})
	}

	if req.Email == "" || req.Password == "" {
		return ctx.Response().Json(400, http.Json{
			"error": "Email and password are required",
		})
	}

	var user models.User
	// Lakukan pencarian user berdasarkan email dan password
	if err := facades.Orm().Query().Where("email", req.Email).Where("password", req.Password).First(&user); err != nil {
		return ctx.Response().Json(401, http.Json{
			"error": "Invalid email or password",
		})
	}

	// Validasi tambahan: Pastikan user benar-benar ditemukan (ID tidak 0)
	if user.ID == 0 {
		return ctx.Response().Json(401, http.Json{
			"error": "Invalid email or password",
		})
	}

	token, err := services.NewJwtGenerate(user.ID)
	if err != nil {
		return ctx.Response().Json(500, http.Json{
			"error": "Failed to generate token",
		})
	}

	return ctx.Response().Json(200, http.Json{
		"user_id": user.ID,
		"token": token,
	})
	// Contoh validasi sederhana
}


func Register(ctx http.Context) http.Response {
	
	var req struct {
		Email string `json:"email"`
		Password string `json:"password"`
		Name string `json:"name"`
	}

	if err := ctx.Request().Bind(&req); err != nil {
		return ctx.Response().Json(400, http.Json{
			"error": "Invalid request",
		})
	}

	if req.Email == "" || req.Password == "" || req.Name == "" {
		return ctx.Response().Json(400, http.Json{
			"error": "Email, password, and name are required",
		})
	}

	var user models.User
	exists, err := facades.Orm().Query().Model(&user).Where("email", req.Email).Exists()
	
	if err != nil {
		return ctx.Response().Json(500, http.Json{
			"error": "Failed to check existing user",
			"details": err.Error(),
		})
	}

	if exists {
		return ctx.Response().Json(400, http.Json{
			"error": "Email already registered",
		})
	}

	
	user.Email = req.Email
	user.Password = req.Password
	user.Name = req.Name

	if err := facades.Orm().Query().Create(&user); err != nil {
		return ctx.Response().Json(500, http.Json{
			"error": "Failed to create user",
		})
	}

	token, err := services.NewJwtGenerate(user.ID)
	if err != nil {
		return ctx.Response().Json(500, http.Json{
			"error": "Failed to generate token",
		})
	}

	return ctx.Response().Json(201, http.Json{
		"user_id": user.ID,
		"token": token,
	})
}