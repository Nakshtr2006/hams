package com.nakshtr.hams.dto;

import com.nakshtr.hams.entity.Gender;
import com.nakshtr.hams.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    private String name;

    private String phone;

    private Gender gender;

    private Role role;

    private boolean active;
}