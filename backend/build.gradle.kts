plugins {
	java
	id("org.springframework.boot") version "3.4.4"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "vn.hust.omni"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	annotationProcessor("org.mapstruct:mapstruct-processor:1.6.0")
	annotationProcessor("org.projectlombok:lombok-mapstruct-binding:0.2.0")
	annotationProcessor("org.projectlombok:lombok:1.18.34")
	annotationProcessor ("org.hibernate.orm:hibernate-jpamodelgen")

	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")

	implementation("org.apache.commons:commons-lang3:3.16.0")
	implementation("org.projectlombok:lombok-mapstruct-binding:0.2.0")
	implementation("org.mapstruct:mapstruct-processor:1.6.0")
	implementation("org.mapstruct:mapstruct:1.6.0")
	implementation("jakarta.validation:jakarta.validation-api:3.1.0")
	implementation("com.fasterxml.jackson.core:jackson-core:2.18.2")
	implementation("com.fasterxml.jackson.core:jackson-databind:2.18.2")
	implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.18.2")
	implementation("com.google.guava:guava:32.1.2-jre")
	implementation("commons-validator:commons-validator:1.7")
	implementation("com.googlecode.libphonenumber:libphonenumber:8.13.30")
	implementation("commons-io:commons-io:2.15.1")
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("io.projectreactor:reactor-core:3.4.11")

	implementation("org.springframework.boot:spring-boot-starter-mail")
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.springframework.kafka:spring-kafka")
	implementation("org.apache.kafka:connect-api:3.7.0")
	implementation("org.apache.kafka:connect-json:3.7.0")

	compileOnly("org.projectlombok:lombok:1.18.34")
	compileOnly ("org.hibernate.orm:hibernate-jpamodelgen")

	runtimeOnly("com.mysql:mysql-connector-j")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.kafka:spring-kafka-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
