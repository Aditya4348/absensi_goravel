package routes

import (
	"github.com/goravel/framework/facades"

	"apk_absensi/app/http/controllers"
)

func Api() {
	userController := controllers.NewUserController()
	facades.Route().Get("/users/{id}", userController.Show)

	// Route untuk login
	facades.Route().Post("/login", controllers.Login)
	facades.Route().Post("/register", controllers.Register)
}
